import express from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import { ConnectMongo } from './db/connect';
import Config from './models/conf';
import { createQeueue } from './controllers/queue';
const app = express();
app.use(express.json());




app.post('/create', async  (req, res)=>{
    // This will first create Hashes (for DB password, and name) and then add the details to DB, then push to queue for creation
    // {
    //     "name":"user1",
    //     "dbname":"mydb1"
    // }
    const {name, dbname } = req.body;
    const randomHash = crypto.randomBytes(6).toString('hex');
    const randomPassword = crypto.randomBytes(6).toString('hex');
    const newConf = new Config({
        hash:randomHash,
        name:name,
        pass:randomPassword,
    });
    try{
        newConf.save();
    }
    catch(e){
        console.log(e);
        res.json({"Error while pushing to queue and DB":e});
    }
    // Now we push to queue with 'make' type
    try{
        await createQeueue.add({
            type:'make',
            name:name,
            dbname:dbname,
            randomHash:randomHash,
            randomPassword:randomPassword,
        });
        res.json({"Messsage":"Database Flagged for Creation, You will see soon", "ID":randomHash}).status(200);
    }
    catch(e){
        console.log("Error Pushing to Queue");
        res.json({"Error Pushing to Queue":e}).status(500);
    }
});


app.post('/delete/:id', async (req, res)=>{
    const {id} = req.params;
    const conf = await Config.findOne({hash:id});
    if(!conf){
        res.json({"Error":"Could NOT find your Database"}).status(500);
    }
    if(conf?.status !=='UP'){
        res.json({"Message":"Your Database is not up yet", "Status":conf?.status});
    }
    // push to queue with 'delete' type
    try{
        await createQeueue.add({
            type:'make',
            name:conf?.name,
            dbname:conf?.dbname,
            randomHash:conf?.hash,
            randomPassword:conf?.pass,
        });
        res.json({"Messsage":"Database Flagged for Creation, You will see soon"}).status(200);
    }
    catch(e){
        console.log("Error Pushing to Queue");
        res.json({"Error Pushing to Queue":e}).status(500);
    }
})

app.get('/uri/:id', async (req, res)=>{
    const {id} = req.params;
    const conf = await Config.findOne({hash:id});
    if(!conf){
        res.json({"Error":"Could NOT find your Database"}).status(500);
    }
    if(conf?.status !=='UP'){
        res.json({"Message":"Your Database is not up yet", "Status":conf?.status});
    }
    const uri = `mongodb://${conf?.name}:${conf?.pass}@localhost:${conf?.port}` // localhost might be replaced by domain/server name/ip
    res.json({"Message":`We got your URI!`, "URI":uri}).status(200);
})


app.listen(process.env.PORT||5050, ()=>{
    console.log("Queue-Server live on Port: ", process.env.PORT||5050)
});
ConnectMongo();
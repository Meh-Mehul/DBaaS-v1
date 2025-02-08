import { runMongoContainer, deleteMongoContainer } from './createMongoWorker';
// import crypto from 'crypto';
import { findAvailablePort } from './findPort';
import Config from '../models/conf';
// will add queue to this service and the delete one!
export const CreateMongoContainer = async (req:any, res:any)=>{
    const {name, dbname,randomHash,randomPassword} = req.body;
    // const randomHash = crypto.randomBytes(6).toString('hex');
    // const randomPassword = crypto.randomBytes(6).toString('hex');
    const availablePort = await findAvailablePort(30000, 42000);
    try {
        await runMongoContainer(randomHash, name,dbname,randomPassword, availablePort.toString());
        console.log(`Mongo container started on port ${availablePort}`);
        // add to DB!
        // const newConf = new Config({
        //     name:name,
        //     port:availablePort,
        //     hash:randomHash,
        // }) 
        // newConf.save();
        const conf = await Config.updateOne({hash:randomHash}, {status:'UP', port:availablePort});
        if(!conf){
            res.json({"Messaged":"Could not Find such a Mongo-Worker"});
        }
        //
        res.json({"Message":`Mongo container started on port ${availablePort} and Password: ${randomPassword}`, "MONGO_URI":`mongodb://${name}:${randomPassword}@localhost:${availablePort}`});
    } catch (e) {
        console.error(`Failed to start container on port ${availablePort}:`, e);
        res.status(401).json({"Error":`Failed to start container on port ${availablePort}:`});
    }
}

export const DeletMongoContainer = async (req:any, res:any)=>{
    const {id} = req.params;
    // console.log(id);
    try{
        await deleteMongoContainer(id);
        // console.log("Container Deleted!");
        const conf = await Config.findOneAndDelete({hash:id});
        res.json({"Message":`Successfully deleted the Container ${id}`});
    }
    catch(e){
        console.log("Some Error Occured in Deleting Container")
        res.json({"Error":e});
    }
}
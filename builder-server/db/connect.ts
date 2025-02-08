import mongoose from 'mongoose';
let MONGO_URI = 'mongodb://localhost:27017/dbaas'
// let MONGO_URI = "mongodb://Mehul:104c9e688d34@localhost:30000"
export async function ConnectMongo() {
    try{
        await mongoose.connect(MONGO_URI);
        console.log("Successfully Connected to mongoDB");
    }
    catch(e){
        console.log("Some Error occured and could not connect to mongo");
    }

}


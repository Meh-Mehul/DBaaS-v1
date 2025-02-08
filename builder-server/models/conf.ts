import mongoose, { Mongoose } from "mongoose";
const ConfigSchema = new mongoose.Schema({
    hash:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true,
    },
    port:{
        type:Number,
        required:true,
        default:0
    },
    pass:{
        type:String,
        required:true,
        dafault:"admin", // i know i should hash it but it HAS to be reversible, for now storing it raw
    },
    dbname:{
        type:String,
        required:true,
        default:'mydb',
    },
    status:{
        type: String,
        enum: ['CREATING', 'UP', 'DOWN'],
        default:'CREATING'
    }
})
const Config = mongoose.model("Conf", ConfigSchema);
export default Config;
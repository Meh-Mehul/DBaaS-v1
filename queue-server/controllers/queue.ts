import Queue from 'bull';
import axios from 'axios';
export const createQeueue = new Queue('createQueue');


createQeueue.process(async (job, done)=>{
    try{
        const {type,name, dbname, randomHash, randomPassword} = job.data;
        if(type ==='make'){
            // console.log(name, dbname, randomHash);
            const createResp = await axios.post(`http://localhost:3000/make`, {
                name:name,
                dbname:dbname,
                randomHash:randomHash,
                randomPassword:randomPassword
            });
            done();
        }
        else{
            const delResp = await axios.post(`${process.env.BCK_URL}/remove/${randomHash}`);
            done();
        }
    }
    catch(e){
        console.log(`Error While processing Job ${e}`);
        done();
    }
})
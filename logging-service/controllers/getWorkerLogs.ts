import {Docker} from 'node-docker-api';
import { l } from 'vite/dist/node/types.d-aGj9QkWt';
const docker = new Docker({ host: "http://localhost", port: 2375 });
export async function StreamLogs(containerName:string) {
    const time = Math.floor(Date.now()/1000) - 3600;
    try{
        const containers = await docker.container.list();
        //@ts-expect-error
        const needed = containers.find((c)=>c.data.Names.includes(`/${containerName}`));
        if(!needed){
            console.log("Error: Could Not Get Logs from Container");
            return;
        }
        console.log("Streaming Logs Now!");
        const logstream = await needed.logs({
            follow:false,
            stdout:true,
            stderr:true,
            since:time,
            timestamps:true,
        });
        return logstream;
    }
    catch(e){
        console.log("Error: ",e);
    }
}

export async function handleLogStream(req:any, res:any, next:any) {
    const {name} = req.body;
    const logstream = await StreamLogs(name);
    if(!logstream){
        res.json({"Message":"Error Getting Logs"}, 501);
    }
    res.setHeader('Content-Type', 'text/plain');
    //@ts-expect-error
    logstream.on('data', (data:any)=>{
        res.write(data.toString());
    })
    //@ts-expect-error
    logstream.on('end', ()=>{
        // console.log("Stream Ended");
        // res.write("")
        res.end();
    })
    //@ts-expect-error
    logstream.on('error', (e:any)=>{
        res.status(500).json({"Error":e.message});
    })


}
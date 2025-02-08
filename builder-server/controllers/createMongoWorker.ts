
import {Docker} from 'node-docker-api';
const docker = new Docker({ host: "http://localhost", port: 2375 });
export async function runMongoContainer(randomHash:string, name:string, dbname:string,password:string, alloc_port:string) {
    const containerName = `mongo-${randomHash}`;
    try {
        const container = await docker.container.create({
            Image: 'mongo-worker-node',
            name: containerName,
            Env: [
                `MONGO_INITDB_ROOT_USERNAME=${name}`,
                `MONGO_INITDB_ROOT_PASSWORD=${password}`,
                `MONGO_INITDB_DATABASE=${dbname}`
            ],
            HostConfig: {
                PortBindings: {
                    '27017/tcp': [{ HostPort: `${alloc_port}` }]
                }
            }
        });

        await container.start();
        console.log(`Container ${containerName} started successfully.`);
    } catch (error:any) {
        // console.error('Error creating or starting the container:', error);
        throw new Error(error);
    }
}
export async function deleteMongoContainer(randomHash: string) {
    const containerName = `mongo-${randomHash}`;
    try {
        const containers = await docker.container.list();
        // console.log(containers)
        // console.log(containerName);
        // for(let cont of containers){
        //     //@ts-expect-error
        //     console.log(cont.data.Names)
        // }
        //@ts-expect-error
        const targetContainer = containers.find(container => container.data.Names.includes(`/${containerName}`));

        if (!targetContainer) {
            console.log(`Container ${containerName} not found.`);
            return;
        }
        await targetContainer.stop();
        console.log(`Container ${containerName} stopped.`);
        await targetContainer.delete({ force: true });
        console.log(`Container ${containerName} deleted.`);
    } catch (error: any) {
        console.error(`Error deleting container ${containerName}:`, error);
    }
}

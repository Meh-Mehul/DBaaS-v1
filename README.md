# DBasS-v1

This is a simple implmentation of DataBase-as-a-Service, kind of inspired from Aiven's system.

## Design
This implementation is quite simple, assume we work on a single-node application. This app uses ```docker-api``` to interact with the docker daemon running on that node. It instructs the daemon instance to spawn/delete/stop ```mongo-worker``` containers on demand with given settings. It automatically finds open ports in range ```[30000,42000]``` and assigns the worker container that port along with a URI to be given to the end user.

Another ```logging-service``` is used to get the logs in a container from past 1hr. I have made it so that it streams those logs, changes may be made to get live logs. Since this a long-timed connection, i have decided to load-balance this service (nginx.conf is also provided).

### Note
To reduce the connection overhead in ```builder-server``` i decided to use a redis-queue, thus the ```queue-server``` (may not be needed in case of sharding). More details on future updates in ```todos.txt```.
![alt text](https://github.com/Meh-Mehul/DBaaS-v1/blob/main/dbaas_arch.png)

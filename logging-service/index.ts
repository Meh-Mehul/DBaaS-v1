import express from 'express';
import { handleLogStream } from './controllers/getWorkerLogs';
const PORT =  process.argv[2] ||5000

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.post('/logs', handleLogStream);

app.listen(PORT, ()=>{
    console.log("Logging Server Running on Port ", PORT);
})
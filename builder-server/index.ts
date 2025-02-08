import express from 'express';
import { ConnectMongo } from './db/connect';
import containerRouter from './routes/container';
import cors from 'cors';
import rateLimiter from 'express-rate-limit';
const app = express();
app.use(cors());
app.use(
    rateLimiter({
      windowMs: 5 * 60 * 1000, // 100 request per 5 minutes from one IP.
      max: 100, // limit each IP to 100 requests per windowMs
    })
  );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/',containerRouter);
app.listen(3000, ()=>{
    console.log("Builder-server live at 3000");
})
ConnectMongo();




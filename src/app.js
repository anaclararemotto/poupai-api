import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';

const app = express();

app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4201'],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

routes(app); 

export default app;

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from "./utils/db.js";
import salesRoutes from './routes/salesRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api', salesRoutes);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to DB', err);
    process.exit(1);
  });

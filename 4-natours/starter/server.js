import app from './app.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: './.env' });
const dbConnectionString =
  process.env.DATABASE.replace(
    'PASSWORD',
    process.env.DATABASE_PASSWORD,
  );

mongoose
  .connect(dbConnectionString)
  .then((connection) => {
    console.log('DB connection successful!');
  });

// ------------- 4) Start Server -------------
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

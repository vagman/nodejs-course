import app from './app.js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

// ------------- 4) Start Server -------------
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

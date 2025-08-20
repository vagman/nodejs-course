import app from './app.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: './.env' });
const dbConnectionString =
  process.env.DATABASE.replace(
    'PASSWORD',
    process.env.DATABASE_PASSWORD,
  );

mongoose.connect(dbConnectionString).then(() => {
  console.log('DB connection successful!');
});

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);
const testTour = new Tour({
  name: 'The Park Camper',
  rating: 4.7,
  price: 497,
});

testTour
  .save()
  .then((document) => {
    console.log(document);
  })
  .catch((error) => {
    console.error(`ERROR: ${error} 💣`);
  });

// ------------- 4) Start Server -------------
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
  dbName: process.env.MONGODB_NAME,
  user: process.env.MONGODB_USER,
  pass: process.env.MONGODB_PASSWORD,
  poolSize: 20
});

export default mongoose;

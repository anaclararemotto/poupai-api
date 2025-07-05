import mongoose from "mongoose";

const conectaNaDatabase = async () => {
  const DB_URI = process.env.DB_URI ;
  await mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default conectaNaDatabase;

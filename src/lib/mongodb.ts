import mongoose from 'mongoose';

const connect = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }

  const dbUri = process.env.MONGODB_URI as string;
  await mongoose.connect(dbUri);
};

export default connect;

import mongoose, { Mongoose } from "mongoose";

declare global {
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

const mongodbUri = process.env.MONGODB_URI as string;
// Debug-tiedot MongoDB-yhteydestä
console.log("MONGODB_URI löydetty:", !!mongodbUri);

if (!mongodbUri) {
  throw new Error("MONGODB_URI environment variable is not defined");
}

const cached = global.mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongodbUri, {
        bufferCommands: false,
      })
      .then((mongoose) => {
        console.log("MongoDB-yhteys muodostettu onnistuneesti");
        return mongoose;
      })
      .catch((error) => {
        console.error("MongoDB-yhteyden muodostaminen epäonnistui:", error);
        throw error;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;

import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {};

//Using void here to specify that we don't care about the type of data being retured in promise
async function dbConnect(): Promise<void> {
    //Since next works on edge, we always check first if we have an already existing connection to db to avoid db choking
    if (connection.isConnected) {
        console.log("Already connected to database ⏱️");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

        connection.isConnected = db.connections[0].readyState;

        console.log("DB connected ✅");
    } catch (error) {
        console.error("Database connection failed ❌", error);
        process.exit(1);
    }
}

export default dbConnect;

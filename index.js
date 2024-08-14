import express from "express";
import mongoose from "mongoose";

// Connect to database
await mongoose.connect(process.env.MONGO_URL);

const app = express();

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
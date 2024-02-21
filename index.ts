import express from 'express';
import dotenv from 'dotenv'
import mongoose from 'mongoose';

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI!, {
   }).then(() => {
        console.log('Connected to MongoDB')
    }).catch((err) => {
        console.log(err)
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

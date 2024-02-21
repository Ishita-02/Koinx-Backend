import express from 'express';
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import userRoutes from './routes/index';
import bodyParser from 'body-parser';

dotenv.config()

const app = express()
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI!, {
   }).then(() => {
        console.log('Connected to MongoDB')
    }).catch((err) => {
        console.log(err)
})

app.use(userRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

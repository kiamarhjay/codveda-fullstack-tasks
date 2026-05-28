require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const workoutRoutes = require('./routes/workoutRoutes');
const cors = require('cors');




const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

//app.get('/', (req,res) => {res.send('Server is up and running smoothly...yay! 😍 \n Welcome to my web page 🥺 \n So glad to have you here 😎');});
//CREATE: post
app.use('/api/workouts', workoutRoutes);


const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB Atlas successfully! 🌿');
        app.listen(PORT, () =>{
            console.log(`Server is sprinting on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection failed: ', error.message);
    });



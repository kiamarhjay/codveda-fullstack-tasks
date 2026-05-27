require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Workout = require('./models/Workout');


const app = express();
app.use(express.json());
//app.get('/', (req,res) => {res.send('Server is up and running smoothly...yay! 😍 \n Welcome to my web page 🥺 \n So glad to have you here 😎');});
//CREATE: post
app.post('/api/workouts', async(req,res) => {
    try {
    const {title, duration, reps} = req.body;
    const newWorkout = await Workout.create({ title, duration, reps});
    res.status(201).json(newWorkout);}
    catch(error) {
        res.status(404).json({ error: error.message});
    }
});
//READ: get
app.get('/api/workouts', async (req,res) => {
    try {
        const workouts = await Workout.find().sort({ createdAt: -1});
        res.status(200).json(workouts);}
    catch(error) {
        res.status(500).json({error: error.message});
    }
});
//update: put
app.put('/api/workouts', async (req,res) => {
    try{
        const UpdatedWorkout = await Workout.findByIdAndUpdate (
            req.params.id,
            req.body,
            {new: true}
        );
        res.status(200).json(UpdatedWorkout);}
    catch{
        res.status(400).json({error: error.message});
    }
});
//DELETE: delete
app.delete('/api/workouts/:id', async (req,res) => {
    try{
        await Workout.findByIdAndDelete(req.params.id);
        res.status(200).json({ message:'Workout Deleted Successfully!'});}
        catch{
            res.status(400).json({error: error.message});
        }
});



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



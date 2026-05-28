const Workout = require('../models/Workout');
//To get all workouts - GET/api/workouts
const getWorkouts = async(req,res) => {
    try{
        const workouts = await Workout.find().sort({ createdAt: -1});
        res.status(200).json(workouts); 
    } catch(error) {
        res.status(500).json({error: error.message});
    }
};
//To create new workout - POST/api/workouts
const createWorkout = async(req,res) => {
    try{
        const {title, duration, reps} = req.body;
        //field validation
        if (!title || !duration || !reps) {
            res.status(400).json({error: 'Please fill in all the fields'});
        }
        const newWorkout = await Workout.create({title, duration, reps});
        res.status(201).json(newWorkout);
    } catch (error) {
        res.status(400).json({ error: error.message});
    }
};
//To update workout - PUT/api/workouts/:id
const updateWorkout = async (req,res) => {
    const {id} = req.params;
    try{
        const updatedWorkout = await Workout.findByIdAndUpdate(
            id,
            {...req.body},
            { new:true, runValidators: true }
        );
        return res.status(200).json(updatedWorkout)
    } catch(error) {
        return res.status(400).json({error: error.message});
    }
};
//To delete workout - DELETE/api/workout/:id
const deleteWorkout = async (req,res) => {
    try{
        const deletedWorkout = await Workout.findByIdAndDelete(req.params.id);
        if (!deletedWorkout) {
            res.status(404).json({error: 'Workout not found!'});
        }
        res.status(200).json({message: 'Workout deleted successfully!'});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};
//Exporting controller functions so the route files can read them
module.exports = {getWorkouts, createWorkout, updateWorkout, deleteWorkout};

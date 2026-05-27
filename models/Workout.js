const mongoose = require('mongoose');
const WorkoutSchema = new mongoose.Schema({
    title: {type: String, required: true},
    duration: {type: Number, required: true},
    reps: {type: Number, required: true}},
    {timestamps: true});

    module.exports = mongoose.model('Workout', WorkoutSchema);
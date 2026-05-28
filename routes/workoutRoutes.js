const express = require('express');
const router = express.Router();
const { getWorkouts, createWorkout, updateWorkout, deleteWorkout } = require ('../controllers/workoutControllers')

//Routes without ID parameters
router.get('/', getWorkouts);
router.post('/', createWorkout);
//Routes with ID parameters
router.put('/:id', updateWorkout);
router.delete('/:id', deleteWorkout);


module.exports = router;

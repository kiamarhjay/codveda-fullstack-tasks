const API_URL = 'http://localhost:5000/api/workouts';
const workoutsContainer = document.getElementById('workouts-container');
const workoutForm = document.getElementById('workout-form');

async function fetchWorkouts() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if(data.length === 0) {
            workoutsContainer.innerHTML ='<p>No workouts recorded yet. Get Moving!</p>';
            return;
        }
        workoutsContainer.innerHTML = '';
        data.forEach(workout => {
            const workoutCard = document.createElement('div');
            workoutCard.className = 'workout-card';
            workoutCard.innerHTML = `
                <div class="card-conent">
                <h3>${workout.title}</h3>
                <p><strong>Duration: </strong>${workout.duration} mins</p>
                <p><strong>Reps: </strong>${workout.reps} </p>
                <small> Added: ${new Date(workout.createdAt).toLocaleDateString()}</small>
                </div>
            `;
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerText = '🗑️';

            const workoutID = workout._id || workout.id;

            deleteBtn.onclick = async (e) => {
                e.stopPropagation();
                console.log("Trashcan clicked for ID: ", workoutID);
                await deleteWorkoutFromDB(workoutID);
            };
            workoutCard.appendChild(deleteBtn)
            workoutsContainer.appendChild(workoutCard);
        });
    } catch (error) {
        workoutsContainer.innerHTML = '<p style="color:red;">Error fetching data from server.</p>';
        console.error('Error:', error);
    }
}


workoutForm.addEventListener('submit', async (e) =>{
    e.preventDefault();

    const title = document.getElementById('title').value;
    const duration = document.getElementById('duration').value;
    const reps = document.getElementById('reps').value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({title,duration,reps})
        });

        if(response.ok) {
            workoutForm.reset();
            fetchWorkouts();
        } else {
            alert('Failed to save workout');
        }
    } catch (error) {
        console.error('Error creating workout: ', error);
    }
});

async function deleteWorkoutFromDB(id) {
    if (!id) {
        alert("Error: Missing Workout ID.");
        return;
    }
    if (!confirm('Are you sure you want to delete this workout?!')) return;
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'});
        if (response.ok) {
            fetchWorkouts();
        } else {
            alert(`Failed to delete the workout. Server status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error deleting workout: ', error);
    }
}
//To run when page loads
fetchWorkouts(); 
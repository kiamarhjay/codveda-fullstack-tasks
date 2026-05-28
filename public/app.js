const API_URL = 'http://localhost:5000/api/workouts';
let currentEditingID = null;
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
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.innerText = '✏️';

            editBtn.onclick = async (e) => {
                e.stopPropagation();
                prepareEditForm(workout);
            }


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
            workoutCard.append(editBtn);
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
    const isEditing = currentEditingID !== null;
    const url = isEditing ? `${API_URL}/${currentEditingID}` : API_URL;
    const method = isEditing ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({title,duration,reps})
        });

        if(response.ok) {
            workoutForm.reset();
            currentEditingID = null;
            const submitBtn = workoutForm.querySelector('button[type = "submit"]');
            submitBtn.innerText = 'Add Workout';
            submitBtn.style.background = '#2ecc71';

            fetchWorkouts();
        } else {
            alert('Failed to save data');
        }
    } catch (error) {
        console.error('Error during form submission: ', error);
    }
});

function prepareEditForm(workout) {
    currentEditingID = workout._id || workout.id;
    document.getElementById('title').value = workout.title;
    document.getElementById('duration').value = workout.duration;
    document.getElementById('reps').value = workout.reps;

    const submitbtn = workoutForm.querySelector('button[type = "submit"]');
    submitbtn.innerText = 'Update Workout';
    submitbtn.style.background = '#3498db';
}

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
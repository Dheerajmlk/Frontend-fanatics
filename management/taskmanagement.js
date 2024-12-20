document.addEventListener('DOMContentLoaded', () => {
    let points = 0;
  
    const taskForm = document.getElementById('task-form');
    const taskNameInput = document.getElementById('task-name');
    const taskDescriptionInput = document.getElementById('task-description');
    const taskPriorityInput = document.getElementById('task-priority');
    const taskDueDateInput = document.getElementById('task-due-date');
    const taskListHigh = document.getElementById('high-priority-list');
    const taskListMedium = document.getElementById('medium-priority-list');
    const taskListLow = document.getElementById('low-priority-list');
    const taskListOverdue = document.getElementById('overdue-list');
    const pointsDisplay = document.getElementById('points');
    const resetPointsButton = document.getElementById('reset-points');
  
    const firebaseDatabaseURL = 'https://time-buddy-eb9ab-default-rtdb.firebaseio.com/users/tasks.json';
  
    function updatePoints() {
        pointsDisplay.textContent = points;
    }
  
    function createTaskListItem(task) {
        const listItem = document.createElement('li');
        listItem.classList.add(task.priority);
  
        const taskName = document.createElement('span');
        taskName.classList.add('task-name');
        taskName.textContent = task.name;
  
        const taskDescription = document.createElement('span');
        taskDescription.classList.add('task-description');
        taskDescription.textContent = task.description;
  
        const taskPriority = document.createElement('span');
        taskPriority.classList.add('task-priority');
        taskPriority.textContent = task.priority;
  
        const taskDueDate = document.createElement('span');
        taskDueDate.classList.add('task-due-date');
        taskDueDate.textContent = `Due: ${new Date(task.dueDate).toLocaleDateString()}`;
  
        const taskStatus = document.createElement('span');
        taskStatus.classList.add('task-status');
        taskStatus.textContent = task.status;
  
        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.addEventListener('click', () => {
            if (task.status !== 'completed') {
                task.status = 'completed';
                taskStatus.textContent = task.status;
                completeButton.disabled = true;
                points += task.priority === 'high' ? 3 : task.priority === 'medium' ? 2 : 1;
                updatePoints();
                updateTaskInFirebase(task);
            }
        });
  
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            listItem.remove(); // Delete the task from the UI without affecting points
            deleteTaskFromFirebase(task.id); // Only delete the task from Firebase
        });
  
        listItem.appendChild(taskName);
        listItem.appendChild(taskDescription);
        listItem.appendChild(taskPriority);
        listItem.appendChild(taskDueDate);
        listItem.appendChild(taskStatus);
        listItem.appendChild(completeButton);
        listItem.appendChild(deleteButton);
  
        return listItem;
    }
  
    function fetchTasksFromFirebase() {
        fetch(firebaseDatabaseURL)
            .then(response => response.json())
            .then(data => {
                const tasks = data ? Object.values(data) : [];
                const currentDate = new Date();
  
                tasks.forEach(task => {
                    const listItem = createTaskListItem(task);
                    const taskDueDate = new Date(task.dueDate);
  
                    if (task.status !== 'completed' && taskDueDate < currentDate) {
                        task.status = 'overdue';
                        taskStatus.textContent = task.status;
                    }
  
                    if (task.status === 'overdue') {
                        taskListOverdue.appendChild(listItem);
                    } else if (task.priority === 'high') {
                        taskListHigh.appendChild(listItem);
                    } else if (task.priority === 'medium') {
                        taskListMedium.appendChild(listItem);
                    } else if (task.priority === 'low') {
                        taskListLow.appendChild(listItem);
                    }
                });
            })
            .catch(error => console.error('Error fetching tasks from Firebase:', error));
    }
  
    function saveTaskToFirebase(task) {
        fetch(firebaseDatabaseURL, {
            method: 'POST',
            body: JSON.stringify(task),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            task.id = data.name;
            addTaskToList(task);
        })
        .catch(error => console.error('Error saving task to Firebase:', error));
    }
  
    function addTaskToList(task) {
        const listItem = createTaskListItem(task);
        const taskDueDate = new Date(task.dueDate);
        const currentDate = new Date();
  
        if (task.status === 'completed') {
            points += task.priority === 'high' ? 3 : task.priority === 'medium' ? 2 : 1;
            updatePoints();
        } else if (task.status === 'overdue' || taskDueDate < currentDate) {
            task.status = 'overdue';
        }
  
        if (task.status === 'overdue') {
            taskListOverdue.appendChild(listItem);
        } else if (task.priority === 'high') {
            taskListHigh.appendChild(listItem);
        } else if (task.priority === 'medium') {
            taskListMedium.appendChild(listItem);
        } else if (task.priority === 'low') {
            taskListLow.appendChild(listItem);
        }
    }
  
    function updateTaskInFirebase(task) {
        fetch(`https://time-buddy-eb9ab-default-rtdb.firebaseio.com/users/tasks/${task.id}.json`, {
            method: 'PUT',
            body: JSON.stringify(task),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => console.log('Task updated:', data))
        .catch(error => console.error('Error updating task in Firebase:', error));
    }
  
    function deleteTaskFromFirebase(taskId) {
        fetch(`https://time-buddy-eb9ab-default-rtdb.firebaseio.com/users/tasks/${taskId}.json`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => console.log('Task deleted:', data))
        .catch(error => console.error('Error deleting task from Firebase:', error));
    }
  
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
  
        const task = {
            name: taskNameInput.value,
            description: taskDescriptionInput.value,
            priority: taskPriorityInput.value,
            dueDate: taskDueDateInput.value,
            status: 'pending',
        };
  
        saveTaskToFirebase(task);
        taskForm.reset();
    });
  
    resetPointsButton.addEventListener('click', () => {
        points = 0;
        updatePoints();
    });
  
    fetchTasksFromFirebase();
  });
  
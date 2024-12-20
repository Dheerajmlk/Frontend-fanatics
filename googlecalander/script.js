// app.js
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');
const calendarGrid = document.getElementById('calendar-grid');
const monthYear = document.getElementById('month-year');
const taskForm = document.getElementById('task-form');
const taskName = document.getElementById('task-name');
const taskDescription = document.getElementById('task-description');
const taskDate = document.getElementById('task-date');
const taskTime = document.getElementById('task-time');
const taskDetails = document.getElementById('task-details');
const taskList = document.getElementById('task-list');
const selectedDateElement = document.getElementById('selected-date');

// Store tasks by date
let tasks = {};

// Get the current month and year
let currentDate = new Date();

function renderCalendar() {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    monthYear.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

    // Clear previous grid
    calendarGrid.innerHTML = '';

    // Get the first day of the month and number of days in the month
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

    // Fill the calendar grid with days
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement('div');
        calendarGrid.appendChild(emptyCell);
    }

    for (let day = 1; day <= lastDateOfMonth; day++) {
        const cell = document.createElement('div');
        cell.classList.add('calendar-cell');
        cell.textContent = day;

        const dateKey = `${year}-${month + 1}-${day}`;
        if (tasks[dateKey]) {
            const taskDot = document.createElement('div');
            taskDot.classList.add('task-dot');
            cell.appendChild(taskDot);
        }

        // Add click event to open tasks for that day
        cell.addEventListener('click', () => showTasksForDay(year, month, day));

        calendarGrid.appendChild(cell);
    }
}

function showTasksForDay(year, month, day) {
    const dateKey = `${year}-${month + 1}-${day}`;
    const tasksForDay = tasks[dateKey] || [];
    selectedDateElement.textContent = `${month + 1}/${day}/${year}`;
    taskList.innerHTML = '';

    // Sort tasks by time
    tasksForDay.sort((a, b) => a.time.localeCompare(b.time));

    tasksForDay.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        
        const taskTime = document.createElement('div');
        taskTime.classList.add('task-time');
        taskTime.textContent = task.time;
        
        const taskName = document.createElement('div');
        taskName.classList.add('task-name');
        taskName.textContent = task.name;
        
        const taskDescription = document.createElement('div');
        taskDescription.classList.add('task-description');
        taskDescription.textContent = task.description;

        taskItem.appendChild(taskTime);
        taskItem.appendChild(taskName);
        taskItem.appendChild(taskDescription);
        taskList.appendChild(taskItem);
    });

    taskDetails.style.display = 'block';
}

// Handle adding a task
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const taskDateValue = new Date(taskDate.value);
    const taskDateKey = `${taskDateValue.getFullYear()}-${taskDateValue.getMonth() + 1}-${taskDateValue.getDate()}`;

    const newTask = {
        name: taskName.value,
        description: taskDescription.value,
        time: taskTime.value, // Add the time for the task
        date: taskDateKey
    };

    // Save task to tasks object
    if (!tasks[taskDateKey]) {
        tasks[taskDateKey] = [];
    }
    tasks[taskDateKey].push(newTask);

    // Clear the form
    taskName.value = '';
    taskDescription.value = '';
    taskDate.value = '';
    taskTime.value = '';

    renderCalendar();
});

// Navigation between months
prevMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// Initialize the calendar
renderCalendar();

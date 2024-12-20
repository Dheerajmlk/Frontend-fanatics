
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

let tasks = {};
let currentDate = new Date();

function renderCalendar() {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    monthYear.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

    calendarGrid.innerHTML = '';

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('calendar-cell');
        calendarGrid.appendChild(emptyCell);
    }

    for (let day = 1; day <= lastDateOfMonth; day++) {
        const cell = document.createElement('div');
        cell.classList.add('calendar-cell');

        const dateNumber = document.createElement('div');
        dateNumber.classList.add('date-number');
        dateNumber.textContent = day;

        if (today.getDate() === day && 
            today.getMonth() === month && 
            today.getFullYear() === year) {
            cell.classList.add('today');
        }

        const taskIndicators = document.createElement('div');
        taskIndicators.classList.add('task-indicators');

        const dateKey = `${year}-${month + 1}-${day}`;
        if (tasks[dateKey] && tasks[dateKey].length > 0) {
            const taskCount = document.createElement('div');
            taskCount.classList.add('task-count');
            taskCount.textContent = tasks[dateKey].length;
            cell.appendChild(taskCount);

            tasks[dateKey].slice(0, 2).forEach(task => {
                const taskIndicator = document.createElement('div');
                taskIndicator.classList.add('task-indicator');
                taskIndicator.textContent = task.name;
                taskIndicators.appendChild(taskIndicator);
            });

            if (tasks[dateKey].length > 2) {
                const moreIndicator = document.createElement('div');
                moreIndicator.classList.add('task-indicator');
                moreIndicator.style.backgroundColor = '#666';
                moreIndicator.textContent = `+${tasks[dateKey].length - 2} more`;
                taskIndicators.appendChild(moreIndicator);
            }
        }

        cell.appendChild(dateNumber);
        cell.appendChild(taskIndicators);
        cell.addEventListener('click', () => showTasksForDay(year, month, day));
        calendarGrid.appendChild(cell);
    }
}

function showTasksForDay(year, month, day) {
    const dateKey = `${year}-${month + 1}-${day}`;
    const tasksForDay = tasks[dateKey] || [];
    const date = new Date(year, month, day);
    selectedDateElement.textContent = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    taskList.innerHTML = '';
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
}

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const taskDateValue = new Date(taskDate.value);
    const taskDateKey = `${taskDateValue.getFullYear()}-${taskDateValue.getMonth() + 1}-${taskDateValue.getDate()}`;

    const newTask = {
        name: taskName.value,
        description: taskDescription.value,
        time: taskTime.value,
        date: taskDateKey
    };

    if (!tasks[taskDateKey]) {
        tasks[taskDateKey] = [];
    }
    tasks[taskDateKey].push(newTask);

    taskForm.reset();
    renderCalendar();
});

prevMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

renderCalendar();

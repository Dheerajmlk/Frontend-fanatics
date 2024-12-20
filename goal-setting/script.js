
let goals = [];
let completedGoals = [];

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`.tab[onclick="switchTab('${tabName}')"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabName === 'active' ? 'activeGoals' : 'completedGoals').classList.add('active');
}

function addGoal() {
    const title = document.getElementById('goalTitle').value;
    const description = document.getElementById('goalDescription').value;
    const deadline = document.getElementById('goalDeadline').value;
    
    if (!title) {
        alert('Please enter a goal title');
        return;
    }

    const goal = {
        id: Date.now(),
        title,
        description,
        deadline,
        tasks: [],
        startDate: new Date().toISOString(),
        completed: false
    };

    goals.push(goal);
    saveData();
    renderGoals();
    clearForm();
}

function completeGoal(goalId) {
    const goalIndex = goals.findIndex(g => g.id === goalId);
    if (goalIndex !== -1) {
        const goal = goals[goalIndex];
        goal.completionDate = new Date().toISOString();
        completedGoals.push(goal);
        goals.splice(goalIndex, 1);
        saveData();
        renderGoals();
        renderCompletedGoals();
    }
}

function deleteGoal(goalId, isCompleted = false) {
    if (confirm('Are you sure you want to delete this goal?')) {
        if (isCompleted) {
            completedGoals = completedGoals.filter(g => g.id !== goalId);
        } else {
            goals = goals.filter(g => g.id !== goalId);
        }
        saveData();
        renderGoals();
        renderCompletedGoals();
    }
}

function calculateProgress(goal) {
    if (goal.tasks.length === 0) return 0;
    const completedTasks = goal.tasks.filter(t => t.completed).length;
    return Math.round((completedTasks / goal.tasks.length) * 100);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function renderGoals() {
    const goalsList = document.getElementById('goalsList');
    goalsList.innerHTML = goals.map(goal => `
        <div class="goal-card">
            <div class="goal-header">
                <h3 class="goal-title">${goal.title}</h3>
                <div>
                    <button class="btn btn-success" onclick="completeGoal(${goal.id})">Complete</button>
                    <button class="btn btn-delete" onclick="deleteGoal(${goal.id})">Delete</button>
                </div>
            </div>
            <p>${goal.description}</p>
            <div class="goal-stats">
                <div class="stat">
                    <div class="stat-label">Started</div>
                    <div class="stat-value">${formatDate(goal.startDate)}</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Deadline</div>
                    <div class="stat-value">${formatDate(goal.deadline)}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderCompletedGoals() {
    const completedList = document.getElementById('completedGoalsList');
    completedList.innerHTML = completedGoals.map(goal => `
        <div class="goal-card completed-card">
            <div class="goal-header">
                <h3 class="goal-title">${goal.title}</h3>
                <button class="btn btn-delete" onclick="deleteGoal(${goal.id}, true)">Delete</button>
            </div>
            <p>${goal.description}</p>
            <div class="goal-stats">
                <div class="stat">
                    <div class="stat-label">Started</div>
                    <div class="stat-value">${formatDate(goal.startDate)}</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Completed</div>
                    <div class="stat-value">${formatDate(goal.completionDate)}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function clearForm() {
    document.getElementById('goalTitle').value = '';
    document.getElementById('goalDescription').value = '';
    document.getElementById('goalDeadline').value = '';
}

function saveData() {
    localStorage.setItem('activeGoals', JSON.stringify(goals));
    localStorage.setItem('completedGoals', JSON.stringify(completedGoals));
}

function loadData() {
    const savedGoals = localStorage.getItem('activeGoals');
    const savedCompletedGoals = localStorage.getItem('completedGoals');
    
    if (savedGoals) goals = JSON.parse(savedGoals);
    if (savedCompletedGoals) completedGoals = JSON.parse(savedCompletedGoals);
    
    renderGoals();
    renderCompletedGoals();
}

// Load saved data when the page loads
loadData();

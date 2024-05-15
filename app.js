document.addEventListener('DOMContentLoaded', () => {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let archivedTasks = JSON.parse(localStorage.getItem('archivedTasks')) || [];
    
    const dailyTasks = [
        "Code a website",
        "Make a timer",
        "Create a simulation",
        "Solve a common coding challenge",
        "Build a to-do list app"
    ];

    const taskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const taskListContainer = document.getElementById('task-list-container');
    const checkTasksButton = document.getElementById('check-tasks');
    const removeTasksButton = document.getElementById('remove-tasks');
    const alertBox = document.getElementById('alert');
    const tasksPending = document.getElementById('tasks-pending');
    const pendingCount = document.getElementById('pending-count');
    const dailyChallengeButton = document.getElementById('daily-challenge');
    const archivedPageButton = document.getElementById('archived-page');
    const tasksPageButton = document.getElementById('tasks-page');
    const codeTaskDescription = document.getElementById('code-task-description');
    const acceptTaskButton = document.getElementById('accept-task');
    const declineTaskButton = document.getElementById('decline-task');

    function showAlert(message) {
        alertBox.textContent = message;
        alertBox.classList.add('show');
        setTimeout(() => {
            alertBox.classList.remove('show');
        }, 3000);
    }

    function updatePendingCount() {
        pendingCount.textContent = tasks.length;
        tasksPending.style.display = tasks.length ? 'block' : 'none';
    }

    function addTask(taskText) {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <span>${taskText}</span>
            <span class="check-mark">&#10003;</span>
        `;
        tasks.push(taskText);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updatePendingCount();
        showAlert("Task created!");
        updateCodeTask();
    }

    function handleTaskClick(event) {
        if (event.target.classList.contains('check-mark')) {
            const taskItem = event.target.parentElement;
            const taskText = taskItem.querySelector('span').textContent;
            archivedTasks.push(taskText);
            tasks = tasks.filter(task => task !== taskText);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            localStorage.setItem('archivedTasks', JSON.stringify(archivedTasks));
            updatePendingCount();
            showAlert("Task archived!");
            updateCodeTask();
        }
    }

    function confirmRemoveTasks() {
        if (confirm("Are you sure you want to remove all tasks?")) {
            tasks = [];
            localStorage.setItem('tasks', JSON.stringify(tasks));
            updatePendingCount();
            showAlert("All tasks removed!");
            updateCodeTask();
        }
    }

    function loadRandomDailyTask() {
        const randomTask = dailyTasks[Math.floor(Math.random() * dailyTasks.length)];
        codeTaskDescription.textContent = randomTask;
    }

    function updateCodeTask() {
        if (tasks.length > 0) {
            codeTaskDescription.textContent = tasks[0];
        } else {
            loadRandomDailyTask();
        }
    }

    function navigateToArchivedPage() {
        location.href = 'archived.html';
    }

    function navigateToTasksPage() {
        location.href = 'tasks.html';
    }

    dailyChallengeButton.addEventListener('click', () => {
        window.open('https://leetcode.com/problemset/all/', '_blank');
    });
    archivedPageButton.addEventListener('click', navigateToArchivedPage);
    tasksPageButton.addEventListener('click', navigateToTasksPage);
    checkTasksButton.addEventListener('click', navigateToTasksPage);
    addTaskButton.addEventListener('click', () => addTask(prompt("Enter task description:")));
    removeTasksButton.addEventListener('click', confirmRemoveTasks);
    taskList.addEventListener('click', handleTaskClick);
    acceptTaskButton.addEventListener('click', () => addTask(codeTaskDescription.textContent));
    declineTaskButton.addEventListener('click', loadRandomDailyTask);

    // Initialize with a random daily task
    loadRandomDailyTask();
    updatePendingCount();
});

document.addEventListener('DOMContentLoaded', () => {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let archivedTasks = JSON.parse(localStorage.getItem('archivedTasks')) || [];

    const taskList = document.getElementById('task-list');
    const pendingCount = document.getElementById('pending-count');
    const alertBox = document.getElementById('alert');

    function showAlert(message) {
        alertBox.textContent = message;
        alertBox.classList.add('show');
        setTimeout(() => {
            alertBox.classList.remove('show');
        }, 3000);
    }

    function updatePendingCount() {
        pendingCount.textContent = tasks.length;
    }

    function archiveTask(taskText) {
        archivedTasks.push(taskText);
        tasks = tasks.filter(task => task !== taskText);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('archivedTasks', JSON.stringify(archivedTasks));
        updatePendingCount();
        showAlert("Task archived!");
        displayTasks();
    }

    function handleTaskClick(event) {
        if (event.target.classList.contains('check-mark')) {
            const taskItem = event.target.parentElement;
            const taskText = taskItem.querySelector('span').textContent;
            archiveTask(taskText);
        }
    }

    function displayTasks() {
        taskList.innerHTML = '';
        tasks.forEach(taskText => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.innerHTML = `
                <span>${taskText}</span>
                <span class="check-mark">&#10003;</span>
            `;
            taskList.appendChild(li);
        });
    }

    taskList.addEventListener('click', handleTaskClick);
    displayTasks();
    updatePendingCount();
});

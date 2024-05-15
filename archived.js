document.addEventListener('DOMContentLoaded', () => {
    const archivedTasks = JSON.parse(localStorage.getItem('archivedTasks')) || [];

    const archivedTaskList = document.getElementById('archived-task-list');

    function displayArchivedTasks() {
        archivedTaskList.innerHTML = '';
        archivedTasks.forEach(taskText => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.textContent = taskText;
            archivedTaskList.appendChild(li);
        });
    }

    displayArchivedTasks();
});

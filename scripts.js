document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');

    addTaskButton.addEventListener('click', addTask);
    taskList.addEventListener('click', manageTasks);

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert('Please enter a task.');
            return;
        }

        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <span>${taskText}</span>
            <button class="remove-task">Remove</button>
        `;

        taskList.appendChild(li);
        taskInput.value = '';
    }

    function manageTasks(event) {
        const item = event.target;

        if (item.classList.contains('remove-task')) {
            const taskItem = item.parentElement;
            taskList.removeChild(taskItem);
        } else if (item.tagName === 'SPAN') {
            const taskItem = item.parentElement;
            taskItem.classList.toggle('completed');
        }
    }
});

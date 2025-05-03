document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addButton = document.getElementById('addButton');
    const taskList = document.getElementById('taskList');
    const prioritySelect = document.getElementById('prioritySelect');
    const dueDateInput = document.getElementById('dueDateInput');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Load from localStorage

    function renderTasks() {
        taskList.innerHTML = '';  // Clear the list
        tasks.forEach((task, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add(`priority-${task.priority}`); // Add priority class

            listItem.innerHTML = `
                <span class="task-text">${task.text}</span>
                <input type="text" class="edit-input" value="${task.text}">
                <div class="task-details">
                    Priority: ${task.priority}, Due: ${task.dueDate || 'No Due Date'}
                </div>
                <button class="complete-button"><i class="fas fa-check"></i></button>
                <button class="edit-button"><i class="fas fa-edit"></i></button>
                <button class="delete-button"><i class="fas fa-trash"></i></button>
            `;

            const deleteButton = listItem.querySelector('.delete-button');
            deleteButton.addEventListener('click', () => deleteTask(index));

            const completeButton = listItem.querySelector('.complete-button');
            completeButton.addEventListener('click', () => completeTask(index));

            const editButton = listItem.querySelector('.edit-button');
            editButton.addEventListener('click', () => editTask(index, listItem));

            taskList.appendChild(listItem);

            if (task.completed) {
                listItem.querySelector('.task-text').classList.add('completed');
            }
        });
    }

    function updateLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    addButton.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        const priority = prioritySelect.value;
        const dueDate = dueDateInput.value;

        if (taskText !== '') {
            const newTask = {
                text: taskText,
                priority: priority,
                dueDate: dueDate,
                completed: false
            };

            tasks.push(newTask);
            updateLocalStorage();
            renderTasks();

            taskInput.value = '';
            prioritySelect.value = 'medium'; // Reset to default
            dueDateInput.value = '';
        }
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        updateLocalStorage();
        renderTasks();
    }

    function completeTask(index) {
        tasks[index].completed = !tasks[index].completed;
        updateLocalStorage();
        renderTasks();
    }

    function editTask(index, listItem) {
        listItem.classList.add('editing');
        const taskTextElement = listItem.querySelector('.task-text');
        const editInput = listItem.querySelector('.edit-input');
        editInput.style.display = 'inline-block';
        editInput.focus();

        editInput.addEventListener('blur', () => saveTask(index, listItem));
        editInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                saveTask(index, listItem);
            }
        });
    }

    function saveTask(index, listItem) {
        const editInput = listItem.querySelector('.edit-input');
        const newText = editInput.value.trim();

        if (newText !== '') {
            tasks[index].text = newText;
            updateLocalStorage();
            renderTasks();
        } else {
            // Revert to original task text if the input is empty
            renderTasks();
        }
        listItem.classList.remove('editing');
    }

    renderTasks(); // Initial render
});
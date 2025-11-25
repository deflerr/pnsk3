document.addEventListener('DOMContentLoaded', () => {
    const taskDialog = document.getElementById('task-dialog');
    const taskForm = document.getElementById('task-form');
    const cancelDialogButton = document.getElementById('cancel-dialog');
    const addTaskButton = document.getElementById('add-task');
    const plannedTasksContainer = document.getElementById('planned-tasks');
    const inProgressTasksContainer = document.getElementById('in-progress-tasks');
    const testingTasksContainer = document.getElementById('testing-tasks');
    const doneTasksContainer = document.getElementById('done-tasks');

    let tasks = [];

    const openDialog = (task = null) => {
        
        taskDialog.showModal();
    };

    const closeDialog = () => {
        taskDialog.close();
    };

    const saveTask = (event) => {
        event.preventDefault();
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-desc').value;
        const deadline = document.getElementById('task-deadline').value;
        const id = document.getElementById('task-id').value;
    
        if (id) {
          const taskIndex = tasks.findIndex(task => task.id === id);
          if (taskIndex !== -1) {
            tasks[taskIndex] = { ...tasks[taskIndex], title, description, deadline, lastEdited: new Date().toISOString() };
          }
        } else {
          const newTask = {
            id: Date.now().toString(),
            title,
            description,
            deadline,
            createdAt: new Date().toISOString(),
            lastEdited: null,
            status: 'planned'
          };
          tasks.push(newTask);
        }
        renderTasks();
        closeDialog();
    };

    const deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    };

    const moveTask = (id, newStatus, reason = null) => {
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
          tasks[taskIndex].status = newStatus;
          tasks[taskIndex].lastEdited = new Date().toISOString();
          if (reason) {
            tasks[taskIndex].reason = reason;
          }
        }
        renderTasks();
      };
      
      const renderTasks = () => {
        plannedTasksContainer.innerHTML = '';
        inProgressTasksContainer.innerHTML = '';
        testingTasksContainer.innerHTML = '';
        doneTasksContainer.innerHTML = '';
    
        tasks.forEach(task => {
          const taskElement = document.createElement('div');
          taskElement.className = 'task-card';
          taskElement.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>Дедлайн: ${new Date(task.deadline).toLocaleString()}</p>
            <p>Создана: ${new Date(task.createdAt).toLocaleString()}</p>
            ${task.lastEdited ? `<p>Изменена: ${new Date(task.lastEdited).toLocaleString()}</p>` : ''}
            ${task.reason ? `<p>Причина возврата: ${task.reason}</p>` : ''}
            <button class="edit-task">Редактировать</button>
            <button class="delete-task">Удалить</button>
          `;
    
          if (task.status === 'planned') {
            taskElement.innerHTML += `<button class="move-task">В работу</button>`;
            plannedTasksContainer.appendChild(taskElement);
          } else if (task.status === 'in-progress') {
            taskElement.innerHTML += `<button class="move-task">В тестирование</button>`;
            inProgressTasksContainer.appendChild(taskElement);
          } else if (task.status === 'testing') {
            taskElement.innerHTML += `
              <button class="move-task">Выполнено</button>
              <button class="return-task">Вернуть</button>
            `;
            testingTasksContainer.appendChild(taskElement);
          } else if (task.status === 'done') {
            const deadlineExceeded = new Date(task.deadline) < new Date();
            taskElement.innerHTML += `<p>${deadlineExceeded ? 'Просрочено' : 'Выполнено в срок'}</p>`;
            doneTasksContainer.appendChild(taskElement);
          }
    
          taskElement.querySelector('.edit-task').addEventListener('click', () => openDialog(task));
          taskElement.querySelector('.delete-task').addEventListener('click', () => deleteTask(task.id));
    
          if (task.status === 'planned') {
            taskElement.querySelector('.move-task').addEventListener('click', () => moveTask(task.id, 'in-progress'));
          } else if (task.status === 'in-progress') {
            taskElement.querySelector('.move-task').addEventListener('click', () => moveTask(task.id, 'testing'));
          } else if (task.status === 'testing') {
            taskElement.querySelector('.move-task').addEventListener('click', () => moveTask(task.id, 'done'));
            taskElement.querySelector('.return-task').addEventListener('click', () => {
              const reason = prompt('Укажите причину возврата:');
              if (reason) moveTask(task.id, 'in-progress', reason);
            });
          }
        });
      };
      
    addTaskButton.addEventListener('click', () => openDialog());
    cancelDialogButton.addEventListener('click', closeDialog);
    taskForm.addEventListener('submit', saveTask);

    renderTasks();
});
document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const searchTaskInput = document.getElementById('search-task');
  
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let dragSrcEl = null;
  
    // Guardar tareas en localStorage
    function saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  
    // Añadir tarea
    function addTask() {
      const taskText = taskInput.value.trim();
      if (taskText !== '') {
        const task = { id: Date.now(), text: taskText };
        tasks.push(task);
        taskInput.value = '';
        renderTasks();
        saveTasks();
      }
    }
  
    addTaskButton.addEventListener('click', addTask);
  
    taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addTask();
      }
    });
  
    // Renderizar tareas
    function renderTasks(filter = '') {
      taskList.innerHTML = '';
      tasks
        .filter(task => task.text.toLowerCase().includes(filter.toLowerCase()))
        .forEach(task => {
          const li = document.createElement('li');
          li.classList.add('task-item');
          li.setAttribute('draggable', true);
          li.setAttribute('data-id', task.id);
          li.innerHTML = `
            <span>${task.text}</span>
            <div class="task-buttons">
              <button class="edit-btn">Edit</button>
              <button class="delete-btn">🗑️</button>
            </div>
          `;
  
          li.addEventListener('dragstart', handleDragStart);
          li.addEventListener('dragover', handleDragOver);
          li.addEventListener('drop', handleDrop);
          li.addEventListener('dragend', handleDragEnd);
  
          taskList.appendChild(li);
        });
    }
  
    // Editar tarea
    taskList.addEventListener('click', (e) => {
      if (e.target.classList.contains('edit-btn')) {
        const li = e.target.closest('.task-item');
        const taskId = parseInt(li.getAttribute('data-id'), 10);
        const taskText = prompt('Edit task:', li.querySelector('span').textContent);
        if (taskText !== null) {
          tasks = tasks.map(task => task.id === taskId ? { ...task, text: taskText } : task);
          renderTasks(searchTaskInput.value);
          saveTasks();
        }
      }
    });
  
    // Eliminar tarea
    taskList.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-btn')) {
        const li = e.target.closest('.task-item');
        const taskId = parseInt(li.getAttribute('data-id'), 10);
        tasks = tasks.filter(task => task.id !== taskId);
        renderTasks(searchTaskInput.value);
        saveTasks();
      }
    });
  
    // Funciones de arrastrar y soltar
    function handleDragStart(e) {
      dragSrcEl = this;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', this.innerHTML);
      this.classList.add('dragging');
    }
  
    function handleDragOver(e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      e.dataTransfer.dropEffect = 'move';
      return false;
    }
  
    function handleDrop(e) {
      if (e.stopPropagation) {
        e.stopPropagation();
      }
  
      if (dragSrcEl !== this) {
        const srcId = parseInt(dragSrcEl.getAttribute('data-id'), 10);
        const targetId = parseInt(this.getAttribute('data-id'), 10);
  
        const srcIndex = tasks.findIndex(task => task.id === srcId);
        const targetIndex = tasks.findIndex(task => task.id === targetId);
  
        const [removed] = tasks.splice(srcIndex, 1);
        tasks.splice(targetIndex, 0, removed);
  
        renderTasks(searchTaskInput.value);
        saveTasks();
      }
      return false;
    }
  
    function handleDragEnd() {
      this.classList.remove('dragging');
    }
  
    // Buscar tareas
    searchTaskInput.addEventListener('input', (e) => {
      renderTasks(e.target.value);
    });
  
    // Renderizar las tareas al cargar la página
    renderTasks();
  });
  
document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const taskCounter = document.getElementById('taskCounter');
    const clearAllBtn = document.getElementById('clearAllBtn');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Carrega tarefas ao iniciar
    renderTasks();
    
    // Adiciona nova tarefa
    addTaskBtn.addEventListener('click', addTask);
    
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Limpa todas as tarefas
    clearAllBtn.addEventListener('click', clearAllTasks);
    
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const newTask = {
                id: Date.now(),
                text: taskText,
                completed: false
            };
            
            tasks.push(newTask);
            saveTasks();
            renderTasks();
            taskInput.value = '';
            taskInput.focus();
        }
    }
    
    function renderTasks() {
        taskList.innerHTML = '';
        
        if (tasks.length === 0) {
            taskList.innerHTML = '<li class="list-group-item text-center text-muted">Nenhuma tarefa adicionada</li>';
            clearAllBtn.disabled = true;
        } else {
            clearAllBtn.disabled = false;
            
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.className = `list-group-item task-item d-flex justify-content-between align-items-center ${task.completed ? 'completed' : ''}`;
                li.setAttribute('data-id', task.id);
                
                li.innerHTML = `
                    <div class="form-check">
                        <input class="form-check-input task-checkbox" type="checkbox" ${task.completed ? 'checked' : ''}>
                        <label class="form-check-label">${task.text}</label>
                    </div>
                    <button class="btn btn-sm btn-danger delete-btn">×</button>
                `;
                
                taskList.appendChild(li);
            });
        }
        
        updateTaskCounter();
        
        // Adiciona eventos aos novos elementos
        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', toggleTaskStatus);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteTask);
        });
    }
    
    function toggleTaskStatus(e) {
        const taskId = parseInt(e.target.closest('li').getAttribute('data-id'));
        const task = tasks.find(t => t.id === taskId);
        
        if (task) {
            task.completed = e.target.checked;
            saveTasks();
            renderTasks();
        }
    }
    
    function deleteTask(e) {
        const taskId = parseInt(e.target.closest('li').getAttribute('data-id'));
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks();
        renderTasks();
    }
    
    function clearAllTasks() {
        if (confirm('Tem certeza que deseja limpar todas as tarefas?')) {
            tasks = [];
            saveTasks();
            renderTasks();
        }
    }
    
    function updateTaskCounter() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.completed).length;
        
        taskCounter.textContent = `${completedTasks} de ${totalTasks} tarefas concluídas`;
    }
    
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
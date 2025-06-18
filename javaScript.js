document.addEventListener('DOMContentLoaded', function() {
    // Elementos
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const taskCounter = document.getElementById('taskCounter');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Carrega tarefas salvas ou inicia vazio
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    
    // Mostra as tarefas
    showTasks();
    
    // Adicionar tarefa
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTask();
    });
    
    // Filtros
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            showTasks();
        });
    });
    
    // Limpar tarefas
    clearAllBtn.addEventListener('click', clearAll);
    clearCompletedBtn.addEventListener('click', clearCompleted);
    
    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({
                id: Date.now(),
                text: text,
                completed: false
            });
            saveTasks();
            taskInput.value = '';
            showTasks();
        }
    }
    
    function showTasks() {
        taskList.innerHTML = '';
        
        // Filtra as tarefas
        let filteredTasks = tasks;
        if (currentFilter === 'pending') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }
        
        // Mostra mensagem se não houver tarefas
        if (filteredTasks.length === 0) {
            const message = currentFilter === 'all' ? 'Nenhuma tarefa' : 
                          currentFilter === 'pending' ? 'Nenhuma pendente' : 'Nenhuma concluída';
            taskList.innerHTML = `<li class="list-group-item">${message}</li>`;
            return;
        }
        
        // Adiciona cada tarefa na lista
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <div>
                    <input type="checkbox" ${task.completed ? 'checked' : ''} class="me-2">
                    ${task.text}
                </div>
                <button class="btn btn-sm btn-danger">X</button>
            `;
            
            // Eventos para checkbox e botão de deletar
            const checkbox = li.querySelector('input');
            const deleteBtn = li.querySelector('button');
            
            checkbox.addEventListener('change', function() {
                task.completed = this.checked;
                saveTasks();
                showTasks();
            });
            
            deleteBtn.addEventListener('click', function() {
                tasks = tasks.filter(t => t.id !== task.id);
                saveTasks();
                showTasks();
            });
            
            taskList.appendChild(li);
        });
        
        updateCounter();
    }
    
    function clearAll() {
        if (confirm('Limpar todas as tarefas?')) {
            tasks = [];
            saveTasks();
            showTasks();
        }
    }
    
    function clearCompleted() {
        if (confirm('Limpar tarefas concluídas?')) {
            tasks = tasks.filter(task => !task.completed);
            saveTasks();
            showTasks();
        }
    }
    
    function updateCounter() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        taskCounter.textContent = `${completed} de ${total} concluídas`;
        
        clearAllBtn.disabled = total === 0;
        clearCompletedBtn.disabled = completed === 0;
    }
    
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
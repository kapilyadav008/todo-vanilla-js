let todoList = [];
let currentFilter = "all";
const todoInput = document.getElementById('todo-input');
const todoButton = document.getElementById('add-btn');
const todoItems = document.getElementById('todo-list');
const todofilter = document.querySelector('.filters');

function loadTodos() {
    let todos = localStorage.getItem("Todos");
    if (todos) {
        todoList = JSON.parse(todos);
        renderTodos()
    }
}

loadTodos();

function saveTodos() {
    let todos = JSON.stringify(todoList);
    localStorage.setItem("Todos", todos);
}

function addTodo(e) {
    if (e.type === "click" || (e.type === "keydown" && e.key === "Enter")) {
        const todoText = todoInput.value.trim();
        todoInput.value = ''

        if (todoText === '') return;
        let item = {
            id: Date.now(),
            text: todoText,
            completed: false
        }
        todoList.push(item);

        saveTodos()
        renderTodos()
    }
}

function renderTodos() {

    todoItems.innerHTML = "";

    if (todoList.length === 0) {
        let list = document.createElement('li');
        list.textContent = "No Tasks yet"
        todoItems.appendChild(list);
        return;
    }

    let filterList = todoList;
    if(currentFilter === "active"){
        filterList = todoList.filter(task => !task.completed);
    }
    else if(currentFilter === "completed"){
        filterList = todoList.filter(task => task.completed);
    }

    if (filterList.length === 0) {
        let list = document.createElement('li');
        list.textContent = `No ${currentFilter} Tasks yet`
        todoItems.appendChild(list);
        return;
    }

    filterList.forEach((task, index) => {
        let list = document.createElement('li');
        let checkbox = document.createElement('input');
        let button = document.createElement('button');
        let span = document.createElement('span');

        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        button.textContent = "Delete";
        span.textContent = task.text;

        if (task.completed) span.classList.add("completed");
        list.dataset.id = task.id;
        list.append(checkbox, span, button);

        todoItems.appendChild(list)
    });
}

function handleListClick(event) {
    if (event.target.tagName === "BUTTON") {
        let li = event.target.closest("li");
        const id = Number(li.dataset.id);
        const idx = todoList.findIndex(t => t.id === id);
        if (idx === -1) return;
        todoList.splice(idx, 1);
        saveTodos()
        renderTodos()
    }
    else if (event.target.tagName === "INPUT" && event.target.type === "checkbox") {
        let li = event.target.closest("li");
        const id = Number(li.dataset.id);
        const idx = todoList.findIndex(t => t.id === id);
        if (idx === -1) return;
        todoList[idx].completed = !todoList[idx].completed;
        saveTodos()
        renderTodos()
    }
}

function handleFilterClick(e){
    if(e.target.tagName === "BUTTON"){
        const filterName=e.target.dataset.filter;
        currentFilter = filterName;
        document.querySelectorAll(".active").forEach(e => {
            e.classList.remove("active");
        });
        e.target.classList.add("active")
        renderTodos()
    }

}

todoButton.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', addTodo);
todoItems.addEventListener('click', handleListClick);
todofilter.addEventListener('click',handleFilterClick);




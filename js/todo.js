'use strict';

const field = document.querySelector('.field');
const add = document.querySelector('.add');
const list = document.querySelector('.list');
const deleteAllBtn = document.querySelector('.deleteAllBtn');
const noTasks = document.querySelector('.no-tasks');

function saveTasks() {
    const tasks = document.querySelectorAll('.task');

    const data = [...tasks].map((task, index) => ({
        id: index,
        content: task.querySelector(".text").textContent,
        status: task.querySelector(".status").checked,
    }));
    
    localStorage.setItem("tasks", JSON.stringify(data));
};

function loadTasks() {
    const data = JSON.parse(localStorage.getItem("tasks")) || [];
  
    data.forEach((task) => {
      const newTask = createTask(task.content);
  
      if (task.status) {
        newTask.classList.add("success");
        newTask.querySelector(".status").checked = true;
      }
  
      list.appendChild(newTask);
    });
  };

function createTask(value) {
    const task = document.createElement('div');

    const text = document.createElement('p');
    text.textContent = value;
    task.appendChild(text);
    task.classList.add('task');
    text.classList.add('text');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'status';
    task.appendChild(checkbox);
    checkbox.addEventListener('click', completeTask);
   
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'deleteBtn fa fa-times'
    task.appendChild(deleteBtn);
    deleteBtn.addEventListener('click', deleteTask);

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'editBtn fa fa-pencil';
    task.appendChild(editBtn);
    editBtn.addEventListener('click', editTask);

    return task;
};

function addTask() {
    if (field.value.trim()) {  
        const newTask = createTask(field.value);
        list.appendChild(newTask);
        field.value = '';

        saveTasks();
    }
};

function completeTask(event) {
    const target = event.target;
    const parent = target.parentElement;

    parent.classList.toggle('success');

    saveTasks();
};

function deleteAllTask() {
    const taskList = list.children;

    if (!taskList.length) {
        
        alert('Текущих задач нет');

    } else if (confirm('Вы хотите удалить все задачи. Продолжить?')) {
        for (let i = 0; i < taskList.length; i++) {
            while (taskList[i] !== undefined) {
                taskList[i].remove();
            } 
        }
        localStorage.clear();
    }
};

function deleteTask(event) {
    const target = event.target.parentElement;
    list.removeChild(target);

    if (list.children.length) {
        saveTasks();
    } else localStorage.clear();
    
};

function editTask(event) {
    const target = event.target.parentElement;
    const taskText = target.firstElementChild;

    event.target.className = 'editBtn fa fa-floppy-o';

    const inputText = document.createElement('input');
    inputText.className = 'taskField text';
    inputText.type = 'text';
    inputText.value = taskText.textContent;
    
    target.replaceChild(inputText, taskText);
    inputText.addEventListener("keydown", saveEditTaskEnter);
    event.target.removeEventListener("click", editTask);
    event.target.addEventListener("click", saveEditTask);
}

function saveEditTaskEnter(event) {
    const textValue = event.target.value;
    const task = event.target.parentElement;
    const taskText = document.createElement('p');
    const button = task.querySelector('.editBtn');
    
    taskText.classList.add('text');
    taskText.textContent = textValue.trim();

    if (event.key === 'Enter' && textValue.trim()) {
        task.replaceChild(taskText, event.target);

        button.className = 'editBtn fa fa-pencil'
        button.removeEventListener("click", saveEditTask);
        button.addEventListener("click", editTask);

        saveTasks();
    }
}

function saveEditTask(event) {
    const task = event.target.parentElement;
    const taskText = document.createElement('p');
    const inputText = task.firstElementChild;
    const textValue = inputText.value;
    const button = task.querySelector('.editBtn')

    taskText.classList.add('text');
    taskText.textContent = textValue.trim();

    if (textValue.trim()) {
        task.replaceChild(taskText, inputText);

        button.className = 'editBtn fa fa-pencil'
        button.removeEventListener("click", saveEditTask);
        button.addEventListener("click", editTask);

        saveTasks();
    }
}

add.addEventListener('click', addTask);

deleteAllBtn.addEventListener('click', deleteAllTask);

field.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && field.value.trim()) {  
        const newTask = createTask(field.value);
        list.appendChild(newTask);
        field.value = '';

        saveTasks();
    }
});

document.addEventListener("DOMContentLoaded", loadTasks);

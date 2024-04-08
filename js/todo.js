'use strict';

const field = document.querySelector('.field');
const add = document.querySelector('.add');
const list = document.querySelector('.list');
const deleteAllBtn = document.querySelector('.deleteAllBtn');

function saveTasks() {
    const tasks = document.querySelectorAll('.task');

    const data = [...tasks].map((task, index) => ({
        id: index,
        content: task.querySelector(".text").textContent,
        status: task.querySelector(".status").checked,
    }));
    
    localStorage.setItem("tasks", JSON.stringify(data));
};

const loadTasks = () => {
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
    checkbox.classList.add('status');
    task.appendChild(checkbox);
    checkbox.addEventListener('click', completeTask);
   
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.classList.add('deleteBtn');
    deleteBtn.innerText = 'Удалить';
    task.appendChild(deleteBtn);
    deleteBtn.addEventListener('click', deleteTask);

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.classList.add('editBtn');
    editBtn.innerText = 'Редактировать';
    task.appendChild(editBtn);
    editBtn.addEventListener('click', editTask);

    return task;
};

function addTask() {
    if (field.value) {  
        const newTask = createTask(field.value);
        list.appendChild(newTask);
        field.value = '';

        saveTasks();
    }
};

function completeTask(event) {
    const target = event.target;
    const parent = target.parentElement;

    if (target.checked) {
        parent.classList.add('success');
    } else {
        parent.classList.remove('success');
    };

    saveTasks();
};

function deleteAllTask() {
    const taskList = list.children;

    if (taskList.length == 0) {
        
        alert('Текущих задач нет');

    } else if (confirm('Вы хотите удалить все задачи. Продолжить?')) {
        for(let i = 0; i < taskList.length; i++) {
            while(taskList[i] !== undefined) {
                taskList[i].remove();
            } 
        }
        localStorage.clear();
    }
};

function deleteTask(event) {
    const target = event.target.parentElement;
    list.removeChild(target);

    if (list.children.length > 1) {
        saveTasks();
    } else localStorage.clear();
    
};

function editTask(event) {
    const target = event.target.parentElement;
    const taskText = target.firstElementChild;

    const inputText = document.createElement('input');
    inputText.classList.add('taskField');
    inputText.type = 'text';
    inputText.value = taskText.textContent;
    
    target.replaceChild(inputText, taskText);
    inputText.addEventListener('keydown', saveEditTask)
}

function saveEditTask(event) {
    const inputText = event.target.value;
    const taskText = document.createElement('p');
    taskText.classList.add('text');
    taskText.textContent = inputText;

    if (event.key === 'Enter' && inputText) {
        event.target.parentElement.replaceChild(taskText, event.target);

        saveTasks();
    }
}

add.addEventListener('click', addTask);

deleteAllBtn.addEventListener('click', deleteAllTask);

field.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && field.value) {  
        const newTask = createTask(field.value);
        list.appendChild(newTask);
        field.value = '';

        saveTasks();
    }
});

document.addEventListener("DOMContentLoaded", loadTasks);
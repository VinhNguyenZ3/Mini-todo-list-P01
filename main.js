const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];
const taskList = $("#task-list");
const todoForm = $(".todo-form");
const todoInput = $("#todo-input");
const todoEdit = $("#todo-input");

function isDuplicateTask(newTitle, excludeIndex = -1) {
  const isDuplicate = tasks.some(
    (task, index) => task.title === newTitle && excludeIndex !== index
  );
  return isDuplicate;
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask(e) {
  e.preventDefault();

  const newTitle = todoInput.value.trim();
  if (isDuplicateTask(newTitle))
    return alert(
      "Task with this title already exists! Please use a different title."
    );

  if (!newTitle) {
    todoInput.value = "";
    return alert("Please write something!");
  }

  tasks.push({
    title: newTitle,
    completed: false,
  });
  renderTasks();
  todoInput.value = "";
}

function handleTaskActions(e) {
  e.preventDefault();
  const itemTodo = e.target.closest(".task-item");
  const taskIndex = +itemTodo.getAttribute("task-index");
  const task = tasks[taskIndex];

  if (e.target.closest(".edit")) {
    const newTitle = prompt("Enter the new task title:", task.title).trim();

    if (isDuplicateTask(newTitle, taskIndex))
      return alert(
        "Task with this title already exists! Please use a different title."
      );

    if (newTitle === null) return;

    if (!newTitle) {
      alert("Task title cannot be empty!");
      return;
    }

    task.title = newTitle;
    renderTasks();
  } else if (e.target.closest(".done")) {
    task.completed = !task.completed;
    renderTasks();
  } else if (e.target.closest(".delete")) {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      tasks.splice(taskIndex, 1);
      renderTasks();
    }
  }
}

function renderTasks() {
  if (!tasks.length) {
    taskList.innerHTML = `<li class="empty-message">No tasks available.</li>`;
    return;
  }

  let html = tasks
    .map(
      (task, index) => `<li task-index="${index}" class="task-item ${
        task.completed ? "completed" : ""
      }">
        <span class="task-title">${task.title}</span>
        <div class="task-action">
            <button class="task-btn edit">Edit</button>
            <button class="task-btn done">${
              task.completed ? "Mark as undone" : "Mark as done"
            }</button>
            <button class="task-btn delete">Delete</button>
        </div>
    </li>`
    )
    .join("");
  taskList.innerHTML = html;
  saveTasks();
}

renderTasks();
todoForm.addEventListener("submit", addTask);
taskList.addEventListener("click", handleTaskActions);

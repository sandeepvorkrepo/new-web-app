// Select elements
const newTaskInput = document.getElementById("new-task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.getElementById("clear-completed-btn");
const exportBtn = document.getElementById("export-btn");
const importFileInput = document.getElementById("import-file");
const importBtn = document.getElementById("import-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Render tasks to UI
function renderTasks(filter = "all") {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    if (filter === "active" && task.completed) return;
    if (filter === "completed" && !task.completed) return;

    const li = document.createElement("li");

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;
    if (task.completed) {
      span.classList.add("completed");
    }

    span.addEventListener("click", () => {
      tasks[index].completed = !tasks[index].completed;
      saveAndRender(filter);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveAndRender(filter);
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

// Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Save and re-render
function saveAndRender(filter) {
  saveTasks();
  renderTasks(filter);
}

// Add new task
addTaskBtn.addEventListener("click", () => {
  const text = newTaskInput.value.trim();
  if (text !== "") {
    tasks.push({ text, completed: false });
    newTaskInput.value = "";
    saveAndRender();
  }
});

// Press "Enter" also adds task
newTaskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTaskBtn.click();
  }
});

// Filter buttons
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.getAttribute("data-filter");
    renderTasks(filter);
  });
});

// Clear completed
clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  saveAndRender();
});

// Export tasks as JSON
exportBtn.addEventListener("click", () => {
  const dataStr = JSON.stringify(tasks);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tasks.json";
  a.click();
  URL.revokeObjectURL(url);
});

// Import tasks from JSON
importBtn.addEventListener("click", () => {
  const file = importFileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedTasks = JSON.parse(e.target.result);
      tasks = importedTasks;
      saveAndRender();
    } catch (error) {
      alert("Invalid JSON file");
    }
  };
  reader.readAsText(file);
});

// Keyboard shortcut: press 'n' to focus the input
document.addEventListener("keydown", (e) => {
  if (e.key === "n") {
    newTaskInput.focus();
  }
});

// Initial render
renderTasks();

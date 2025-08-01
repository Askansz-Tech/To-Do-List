// Dark mode toggle
document.getElementById('themeToggle').onclick = () => {
  document.body.dataset.theme = document.body.dataset.theme === 'dark' ? '' : 'dark';
};

// Task Manager
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const taskList = document.getElementById('taskList');
renderTasks();

function addTask() {
  const text = document.getElementById('taskInput').value.trim();
  const priority = document.getElementById('priority').value;
  if (text) {
    tasks.push({ text, done: false, priority });
    saveTasks();
    renderTasks();
    document.getElementById('taskInput').value = '';
  }
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks
    .sort((a, b) => ['low', 'medium', 'high'].indexOf(a.priority) - ['low', 'medium', 'high'].indexOf(b.priority))
    .forEach((task, i) => {
      const li = document.createElement('li');
      li.className = task.done ? 'completed' : '';
      li.innerHTML = `
        <div class="task-meta">
          <span class="task-priority ${task.priority}">●</span>
          <span onclick="toggleTask(${i})">${task.text}</span>
        </div>
        <button onclick="deleteTask(${i})">✕</button>
      `;
      taskList.appendChild(li);
    });
}

// Pomodoro Timer
let timer, isWork = true, timeLeft = 1500;
const timeDisplay = document.getElementById('timeDisplay');
const sessionStatus = document.getElementById('sessionStatus');

function startTimer() {
  if (timer) return;

  const workTime = parseInt(document.getElementById('workTime').value) || 25;
  const breakTime = parseInt(document.getElementById('breakTime').value) || 5;
  if (timeLeft <= 0) timeLeft = (isWork ? workTime : breakTime) * 60;

  timer = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timer);
      timer = null;
      isWork = !isWork;
      sessionStatus.innerText = isWork ? 'Back to Work!' : 'Take a Break!';
      timeLeft = (isWork ? workTime : breakTime) * 60;
      updateTimeDisplay();
      return;
    }
    timeLeft--;
    updateTimeDisplay();
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timer = null;
  isWork = true;
  timeLeft = parseInt(document.getElementById('workTime').value) * 60;
  sessionStatus.innerText = '';
  updateTimeDisplay();
}

function updateTimeDisplay() {
  const min = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const sec = String(timeLeft % 60).padStart(2, '0');
  timeDisplay.textContent = `${min}:${sec}`;
}

resetTimer();

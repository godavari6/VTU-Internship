const themeButton = document.getElementById('theme-toggle');

themeButton.onclick = function() {
    const html = document.documentElement;
    let currentTheme = html.getAttribute('data-theme');
    
    if (currentTheme === "light") {
        html.setAttribute('data-theme', 'dark');
    } else {
        html.setAttribute('data-theme', 'light');
    }
};

const userBtn = document.getElementById('generate-user');
const userContainer = document.getElementById('user-container');

userBtn.onclick = function() {
    document.getElementById('user-loader').classList.remove('hidden');

    fetch('https://randomuser.me/api/')
        .then(function(response) { return response.json(); })
        .then(function(data) {
            const user = data.results[0];
            const card = document.createElement('div');
            card.className = 'user-card';
            
            card.innerHTML = `
                <img src="${user.picture.large}">
                <h3>${user.name.first} ${user.name.last}</h3>
                <p>${user.email}</p>
                <p>📍 ${user.location.country}</p>
            `;
            
            userContainer.prepend(card);
            document.getElementById('user-loader').classList.add('hidden');
        });
};

const weatherBtn = document.getElementById('search-weather');

weatherBtn.onclick = function() {
    const city = document.getElementById('city-input').value.toLowerCase();
    const result = document.getElementById('weather-result');
    
    let lat = 51.5, lon = -0.1; 

    if (city === "tokyo") { lat = 35.6; lon = 139.6; }
    else if (city === "new york") { lat = 40.7; lon = -74.0; }
    else if (city === "delhi") { lat = 28.6; lon = 77.2; }

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        .then(function(res) { return res.json(); })
        .then(function(data) {
            const w = data.current_weather;
            result.innerHTML = `
                <div style="background:var(--bg); padding:12px; border-radius:8px; margin-top:10px;">
                    <strong>${city.toUpperCase() || 'LONDON'}</strong><br>
                    🌡️ Temp: ${w.temperature}°C | 💨 Wind: ${w.windspeed} km/h
                </div>`;
        });
};

const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

let savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
    todoList.innerHTML = "";
    savedTasks.forEach(function(task, index) {
        const li = document.createElement('li');
        li.textContent = task.text;
        if (task.done) li.classList.add('completed');

        li.onclick = function() {
            savedTasks[index].done = !savedTasks[index].done;
            updateStorage();
        };

        li.oncontextmenu = function(e) {
            e.preventDefault();
            savedTasks.splice(index, 1);
            updateStorage();
        };

        todoList.appendChild(li);
    });
}

function updateStorage() {
    localStorage.setItem('tasks', JSON.stringify(savedTasks));
    renderTasks();
}

document.getElementById('add-todo').onclick = function() {
    if (todoInput.value === "") return;
    savedTasks.push({ text: todoInput.value, done: false });
    todoInput.value = "";
    updateStorage();
};

renderTasks();

const products = ['Laptop', 'Smartphone', 'Headphones', 'Keyboard', 'Mouse', 'Camera', 'Smartwatch', 'Monitor'];

function runSearch() {
    const query = document.getElementById('search-box').value.toLowerCase();
    const list = document.getElementById('product-list');
    list.innerHTML = "";

    for (let i = 0; i < products.length; i++) {
        if (products[i].toLowerCase().includes(query)) {
            const li = document.createElement('li');
            li.textContent = "📦 " + products[i];
            list.appendChild(li);
        }
    }
}

document.getElementById('search-box').oninput = runSearch;
runSearch();
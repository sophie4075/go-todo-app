const apiUrl = 'http://localhost:4000/api/todos/';

function fetchTodos() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(todos => {
            const todoList = document.getElementById('todoList');
            todoList.innerHTML = '';
            for (const id in todos) {
                const todo = todos[id];
                const li = document.createElement('li');
                li.textContent = todo.task;
                if (todo.done) {
                    li.classList.add('completed');
                }
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = todo.done;
                checkbox.onclick = () => toggleTodoStatus(id, !todo.done, li);
                li.appendChild(checkbox);
                todoList.appendChild(li);

                const deleteBtn = document.createElement('button');
                deleteBtn.className='deleteButton'
                deleteBtn.textContent = 'Delete';
                deleteBtn.onclick = () => deleteTodo(id, li);
                li.appendChild(deleteBtn);
            }
        })
        .catch(error => console.error('Error fetching todos:', error));
}

function addTodo() {
    const todoInput = document.getElementById('todoInput');
    const task = todoInput.value.trim();
    if (task !== '') {
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task })
        })
            .then(response => response.json())
            .then(() => {
                todoInput.value = '';
                fetchTodos();
            })
            .catch(error => console.error('Error adding todo:', error));
    }
}

function toggleTodoStatus(id, done, element) {
    fetch(`${apiUrl}${id}/done`, {
        method: 'PATCH',
    })
        .then(response => response.json())
        .then(() => {
            if (done) {
                element.classList.add('completed');
                setTimeout(() => {
                    deleteTodo(id, element);
                }, 3000);
            }
        })
        .catch(error => console.error('Error toggling todo status:', error));
}

function deleteTodo(id, element) {
    fetch(`${apiUrl}${id}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (response.ok) {
                element.remove();
            } else {
                throw new Error('Failed to delete todo');
            }
        })
        .catch(error => console.error('Error deleting todo:', error));
}



document.addEventListener('DOMContentLoaded', () => {
    fetchTodos();
});


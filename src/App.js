import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todolist, setTodolist] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState("All");
  const [task, setTask] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(todolist));
  }, [todolist]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.trim()) {
      alert("Task cannot be empty");
      return;
    }

    const isDuplicate = todolist.some(
      (item) => item.text.toLowerCase() === task.trim().toLowerCase()
    );

    if (isDuplicate) {
      alert("Task already exists");
      return;
    }

    setTodolist([
      ...todolist,
      { text: task.trim(), completed: false, id: Date.now() }
    ]);
    setTask("");
  };

  const toggleStatus = (id) => {
    setTodolist((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteItem = (id) => {
    setTodolist((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTasks = todolist.filter((task) =>
    filter === "All"
      ? true
      : filter === "Completed"
      ? task.completed
      : !task.completed
  );

  return (
    <div className="App">
      <h1>📝 ToDo List - Vatsal</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <div className="filter-buttons">
        {["All", "Pending", "Completed"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={filter === type ? "active" : ""}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="outerdiv">
        <ul>
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className={task.completed ? "completetodo" : ""}
              onClick={() => toggleStatus(task.id)}
            >
              {task.text}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  deleteItem(task.id);
                }}
              >
                &times;
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

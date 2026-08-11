import { useEffect, useState } from "react";
import {
  loginUser,
  registerUser,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getAdminDashboard,
} from "./api";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("pending");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskLoading, setTaskLoading] = useState(false);
  
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(
    (task) => task.status === "pending"
  ).length;
  const inProgressTasks = tasks.filter(
   (task) => task.status === "in_progress"
  ).length;
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      loadTasks(token);
    }
  }, []);

const loadTasks = async (token) => {
  setTasksLoading(true);

  try {
    const data = await getTasks(token);
    setTasks(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Failed to load tasks:", error);
  } finally {
    setTasksLoading(false);
  }
};

const loadAdminDashboard = async (token) => {
  setAdminLoading(true);

  try {
    const data = await getAdminDashboard(token);
    setAdminData(data);
  } catch (error) {
    console.error("Failed to load admin dashboard:", error);
  } finally {
    setAdminLoading(false);
  }
};

const handleCreateTask = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  if (!token) {
    return;
  }

  setTaskLoading(true);

  try {
    const taskData = {
      title: taskTitle,
      description: taskDescription,
      status: taskStatus,
      due_date: taskDueDate || null,
    };

    if (editingTask) {
      // Update existing task
      await updateTask(
        token,
        editingTask.id,
        taskData
      );
    } else {
      // Create new task
      await createTask(token, taskData);
    }

    // Reset form
    setTaskTitle("");
    setTaskDescription("");
    setTaskStatus("pending");
    setTaskDueDate("");
    setEditingTask(null);
    setShowTaskForm(false);

    // Refresh task list
    await loadTasks(token);
  } catch (error) {
    console.error(
      "Failed to save task:",
      error
    );

    alert(error.message);
  } finally {
    setTaskLoading(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        const data = await loginUser({
          email,
          password,
        });

if (data.token) {
  localStorage.setItem("token", data.token);
  localStorage.setItem(
    "user",
    JSON.stringify(data.user)
  );

  setUser(data.user);

  await loadTasks(data.token);

  if (data.user.role === "admin") {
    await loadAdminDashboard(data.token);
  }
}
        else {
          setMessage(data.message || "Login failed");
        }
      } else {
        const data = await registerUser({
          name,
          email,
          password,
        });

        setMessage(
          data.message || "Registration successful!"
        );

        if (
          data.message ===
          "User registered successfully"
        ) {
          setTimeout(() => {
            setIsLogin(true);
            setName("");
            setPassword("");
            setMessage(
              "Account created. You can now sign in."
            );
          }, 1000);
        }
      }
    } catch (error) {
      console.error(error);
      setMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setName("");
    setEmail("");
    setPassword("");
    setMessage("");
  };

const handleDeleteTask = async (taskId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return;
  }

  try {
    await deleteTask(token, taskId);

    setTaskToDelete(null);

    await loadTasks(token);
  } catch (error) {
    console.error(
      "Failed to delete task:",
      error
    );

    alert(error.message);
  }
};

const handleEditTask = (task) => {
  setEditingTask(task);
  setTaskTitle(task.title);
  setTaskDescription(task.description || "");
  setTaskStatus(task.status || "pending");

  if (task.due_date) {
    setTaskDueDate(task.due_date.slice(0, 10));
  } else {
    setTaskDueDate("");
  }

  setShowTaskForm(true);
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setTasks([]);
  };

  if (user) {
    return (
      <main className="dashboard">
        <header className="dashboard-header">
          <div>
            <h1>Cloud Task Manager</h1>
            <p>Welcome back, {user.name}</p>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>

        <section className="dashboard-content">
          <div className="section-heading">
            <div>
              <h2>Your Tasks</h2>
              <p>Manage and track your work.</p>
            </div>

            <div className="section-actions">
              <span className="task-count">
                {tasks.length}{" "}
                {tasks.length === 1
                  ? "task"
                  : "tasks"}
              </span>

<div className="dashboard-actions">
  <button
    className="refresh-task-button"
    onClick={() => {
      const token = localStorage.getItem("token");

      if (token) {
        loadTasks(token);
      }
    }}
    disabled={tasksLoading}
  >
    ↻ Refresh
  </button>

  <button
    className="new-task-button"
    onClick={() => setShowTaskForm(true)}
  >
    + New Task
  </button>
</div>
            </div>
          </div>

          <div className="task-stats">
  <div className="stat-card">
    <span className="stat-label">Total tasks</span>
    <strong>{totalTasks}</strong>
  </div>

  <div className="stat-card">
    <span className="stat-label">Pending</span>
    <strong>{pendingTasks}</strong>
  </div>

  <div className="stat-card">
    <span className="stat-label">In progress</span>
    <strong>{inProgressTasks}</strong>
  </div>

  <div className="stat-card">
    <span className="stat-label">Completed</span>
    <strong>{completedTasks}</strong>
  </div>
</div>

          {showTaskForm && (
            <div className="task-form-card">
              <div className="task-form-header">
                <div>
                  <h2>{editingTask ? "Edit task" : "Create a new task"}</h2>
                  <p>
                    {editingTask
                    ? "Update the details of your task."
                    : "Add the details for your new task."}
                  </p>
                </div>

                <button
                  className="close-task-button"
                  onClick={() =>
                    setShowTaskForm(false)
                  }
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateTask}>
                <div className="task-input-group">
                  <label>Task title</label>

                  <input
                    type="text"
                    placeholder="e.g. Deploy application to AWS"
                    value={taskTitle}
                    onChange={(e) =>
                      setTaskTitle(e.target.value)
                    }
                    required
                  />
                </div>

                <div className="task-input-group">
                  <label>Description</label>

                  <textarea
                    placeholder="Describe what needs to be done..."
                    rows="4"
                    value={taskDescription}
                    onChange={(e) =>
                      setTaskDescription(
                        e.target.value
                      )
                    }
                  ></textarea>
                </div>

                <div className="task-form-row">
                  <div className="task-input-group">
                    <label>Status</label>

                    <select
                      value={taskStatus}
                      onChange={(e) =>
                        setTaskStatus(
                          e.target.value
                        )
                      }
                    >
                      <option value="pending">
                        Pending
                      </option>

                      <option value="in_progress">
                        In progress
                      </option>

                      <option value="completed">
                        Completed
                      </option>
                    </select>
                  </div>

                  <div className="task-input-group">
                    <label>Due date</label>

                    <input
                      type="date"
                      value={taskDueDate}
                      onChange={(e) =>
                        setTaskDueDate(
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                <div className="task-form-actions">
                  <button
                    type="button"
                    className="cancel-task-button"
                    onClick={() =>
                      setShowTaskForm(false)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="primary-button create-task-submit"
                    disabled={taskLoading}
                  >
                    {taskLoading
                      ? "Saving..."
                      : editingTask
                      ? "Save changes →"
                      : "Create task →"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {tasksLoading ? (
  <div className="empty-state">
    <div className="loading-spinner"></div>

    <h3>Loading your tasks...</h3>

    <p>
      Just a moment while we fetch your tasks.
    </p>
  </div>

          ) : tasks.length === 0 ? (
<div className="empty-state">
  <div className="empty-icon">✓</div>

  <h3>No tasks yet</h3>

  <p>
    You don't have any tasks yet.
    Create your first task to get started.
  </p>

  <button
    className="empty-create-button"
    onClick={() => setShowTaskForm(true)}
  >
    + Create your first task
  </button>
</div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <div
                  className="task-card"
                  key={task.id}
                >
                  <div className="task-info">
                    <h3>{task.title}</h3>

                    <p>
                      {task.description ||
                        "No description provided."}
                    </p>
                  </div>

                  <div className="task-meta">
                    <span
  className={`status ${task.status}`}
>
  <span className="status-dot"></span>
  {task.status.replace("_", " ")}
</span>
{task.due_date && (
  <span className="due-date">
    Due{" "}
    {task.due_date
      .slice(0, 10)
      .split("-")
      .reverse()
      .join("/")}
  </span>
)}

  <div className="task-actions">
    <button
      className="edit-task-button"
      onClick={() => handleEditTask(task)}
    >
      Edit
    </button>

    <button
  type="button"
  className="delete-task-button"
  onClick={() => {
    console.log("Delete clicked:", task.id);
    setTaskToDelete(task);
  }}
>
  Delete
</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {taskToDelete && (
          <div
            className="modal-overlay"
            onClick={() => setTaskToDelete(null)}
          >
            <div
              className="delete-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="delete-modal-icon">
                !
              </div>

              <h3>Delete this task?</h3>

              <p>
                Are you sure you want to delete{" "}
                <strong>{taskToDelete.title}</strong>?
                This action cannot be undone.
              </p>

              <div className="delete-modal-actions">
                <button
                  type="button"
                  className="cancel-delete-button"
                  onClick={() => setTaskToDelete(null)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="confirm-delete-button"
                  onClick={() =>
                    handleDeleteTask(taskToDelete.id)
                  }
                >
                  Delete task
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="app">
      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>

      <section className="auth-layout">
        <div className="brand-section">
          <div className="brand-icon">✓</div>

          <h1>
            Cloud Task
            <span>Manager</span>
          </h1>

          <p>
            Organize your work, track your progress,
            <br />
            and get things done.
          </p>

          <div className="feature-list">
            <div className="feature">
              <span>✓</span>
              <p>Secure authentication</p>
            </div>

            <div className="feature">
              <span>✓</span>
              <p>Cloud-ready architecture</p>
            </div>

            <div className="feature">
              <span>✓</span>
              <p>Simple task management</p>
            </div>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-header">
            <h2>
              {isLogin
                ? "Welcome back"
                : "Create your account"}
            </h2>

            <p>
              {isLogin
                ? "Sign in to continue to your workspace."
                : "Get started with Cloud Task Manager."}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="input-group">
                <label htmlFor="name">
                  Name
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                />
              </div>
            )}

            <div className="input-group">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Your Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>

            <button
              className="primary-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Sign in"
                : "Create account"}

              {!loading && <span>→</span>}
            </button>
          </form>

          {message && (
            <div className="message">
              {message}
            </div>
          )}

          <div className="divider">
            <span>or</span>
          </div>

          <p className="switch-text">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              type="button"
              className="switch-button"
              onClick={switchMode}
            >
              {isLogin
                ? "Create one"
                : "Sign in"}
            </button>
          </p>
        </div>
      </section>
      
    </main>
  );
}

export default App;
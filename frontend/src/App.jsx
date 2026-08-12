import { useEffect, useRef, useState } from "react";
import {
  loginUser,
  registerUser,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  deleteAdminTask,
  getAdminDashboard,
  getAdminUsers,
  getAdminUserDetails,
  getAdminUserHistory,
  updateAdminTaskPriority,
  getMessages,
  getAdminTasks,
  createAdminTask,
  reassignAdminTask,
  sendMessage,
  markMessagesRead,
  getNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
  verifyOtp,
  resendOtp,
} from "./api";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);

  const [adminData, setAdminData] = useState(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminUsersLoading, setAdminUsersLoading] = useState(false);
  const [adminMessages, setAdminMessages] = useState([]);
  const [adminMessagesLoading, setAdminMessagesLoading] = useState(false);
  const [adminMessageText, setAdminMessageText] = useState("");
  const [adminMessageSending, setAdminMessageSending] = useState(false);
  const [showAdminChat, setShowAdminChat] = useState(false);
  const [selectedAdminUser, setSelectedAdminUser] = useState(null);
  const [adminUserDetails, setAdminUserDetails] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationToast, setNotificationToast] = useState(null);
  const notificationCountRef = useRef(null);


  const [userMessages, setUserMessages] = useState([]);
  const [userMessagesLoading, setUserMessagesLoading] = useState(false);
  const [userMessageText, setUserMessageText] = useState("");
  const [userMessageSending, setUserMessageSending] = useState(false);
  const [showUserChat, setShowUserChat] = useState(false);

  const [adminUserDetailsLoading, setAdminUserDetailsLoading] = useState(false);
  const [adminUserHistory, setAdminUserHistory] = useState([]);
  const [adminUserHistoryLoading, setAdminUserHistoryLoading] = useState(false);

  const [adminTasks, setAdminTasks] = useState([]);
  const [adminTasksLoading, setAdminTasksLoading] = useState(false);

  const [showAdminTaskForm, setShowAdminTaskForm] = useState(false);
  const [adminTaskTitle, setAdminTaskTitle] = useState("");
  const [adminTaskDescription, setAdminTaskDescription] = useState("");
  const [adminTaskStatus, setAdminTaskStatus] = useState("pending");
  const [adminTaskPriority, setAdminTaskPriority] = useState("medium");
  const [adminTaskDueDate, setAdminTaskDueDate] = useState("");
  const [adminTaskAssignee, setAdminTaskAssignee] = useState("");
  const [adminTaskSaving, setAdminTaskSaving] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskSearch, setTaskSearch] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [showDuplicateEmailModal, setShowDuplicateEmailModal] =
  useState(false);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("pending");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskLoading, setTaskLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [adminTaskToDelete, setAdminTaskToDelete] = useState(null);
  
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
  if (resendCooldown <= 0) {
    return;
  }

  const timer = setInterval(() => {
    setResendCooldown((current) => current - 1);
  }, 1000);

  return () => clearInterval(timer);
}, [resendCooldown]);

useEffect(() => {
  if (!user) {
    return;
  }

  loadNotificationCount();

  const interval = setInterval(() => {
    loadNotificationCount();
  }, 10000);

  return () => clearInterval(interval);
}, [user]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
  const parsedUser = JSON.parse(savedUser);

  setUser(parsedUser);
  loadTasks(token);

  if (parsedUser.role === "admin") {
    loadAdminDashboard(token);
    loadAdminUsers(token);
    loadAdminTasks(token);
    loadNotifications();
  }
}
  }, []);

const loadTasks = async (token) => {
  setTasksLoading(true);

  try {
    if (!token) {
      throw new Error("No access token available");
    }

    const data = await getTasks(token);
    setTasks(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Failed to load tasks:", error);
    setTasks([]);
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

const loadAdminUsers = async (token) => {
  setAdminUsersLoading(true);

  try {
    const data = await getAdminUsers(token);
    setAdminUsers(data);
  } catch (error) {
    console.error("Failed to load admin users:", error);
  } finally {
    setAdminUsersLoading(false);
  }
};

const loadNotifications = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return;
  }

  setNotificationsLoading(true);

  try {
    const data = await getNotifications(token);

    const list = Array.isArray(data) ? data : [];

    setNotifications(list);

    setNotificationCount(
      list.filter(
        (notification) =>
          Number(notification.is_read) === 0
      ).length
    );
  } catch (error) {
    console.error(
      "Failed to load notifications:",
      error
    );
  } finally {
    setNotificationsLoading(false);
  }
};

const loadNotificationCount = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return;
  }

  try {
    const data = await getUnreadNotificationCount(token);
    const newCount = Number(data.unreadCount || 0);

    const previousCount = notificationCountRef.current;

    setNotificationCount(newCount);

    // First check after login/page refresh:
    // don't show a toast for old notifications.
    if (previousCount === null) {
      notificationCountRef.current = newCount;
      return;
    }

    // Only show toast when a genuinely new unread notification arrives.
    if (newCount > previousCount) {
      const latestNotifications =
        await getNotifications(token);

      const latestUnread = Array.isArray(
        latestNotifications
      )
        ? latestNotifications.find(
            (notification) =>
              Number(notification.is_read) === 0
          )
        : null;

      if (latestUnread) {
        setNotificationToast(latestUnread);

        setTimeout(() => {
          setNotificationToast(null);
        }, 5000);
      }
    }

    notificationCountRef.current = newCount;
  } catch (error) {
    console.error(
      "Failed to load notification count:",
      error
    );
  }
};

const handleNotificationClick = async (
  notification
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return;
  }

  if (Number(notification.is_read) === 1) {
    return;
  }

  try {
    await markNotificationRead(
      token,
      notification.id
    );

    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id
          ? { ...item, is_read: 1 }
          : item
      )
    );

    setNotificationCount((current) =>
      Math.max(current - 1, 0)
    );
  } catch (error) {
    console.error(
      "Failed to mark notification as read:",
      error
    );
  }
};

const handleMarkAllNotificationsRead = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return;
  }

  try {
    await markAllNotificationsRead(token);

    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        is_read: 1,
      }))
    );

    setNotificationCount(0);
  } catch (error) {
    console.error(
      "Failed to mark all notifications as read:",
      error
    );
  }
};

const loadAdminTasks = async (token) => {
  setAdminTasksLoading(true);

  try {
    const data = await getAdminTasks(token);
    setAdminTasks(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Failed to load admin tasks:", error);
    setAdminTasks([]);
  } finally {
    setAdminTasksLoading(false);
  }
};

const handleAdminCreateTask = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  if (!token) {
    return;
  }

  const trimmedTitle = adminTaskTitle.trim();
  const trimmedDescription = adminTaskDescription.trim();

  if (!trimmedTitle) {
    alert("Task title cannot be empty.");
    return;
  }

  if (!adminTaskAssignee) {
    alert("Please select a user.");
    return;
  }

  if (adminTaskDueDate) {
    const today = new Date().toISOString().split("T")[0];

    if (adminTaskDueDate < today) {
      alert("Due date cannot be in the past.");
      return;
    }
  }

  setAdminTaskSaving(true);

  try {
    await createAdminTask(token, {
      title: trimmedTitle,
      description: trimmedDescription,
      status: adminTaskStatus,
      priority: adminTaskPriority,
      due_date: adminTaskDueDate || null,
      user_id: Number(adminTaskAssignee),
    });

    setAdminTaskTitle("");
    setAdminTaskDescription("");
    setAdminTaskStatus("pending");
    setAdminTaskPriority("medium");
    setAdminTaskDueDate("");
    setAdminTaskAssignee("");
    setShowAdminTaskForm(false);

    await loadAdminTasks(token);
    await loadAdminDashboard(token);
    await loadAdminUsers(token);
  } catch (error) {
    console.error("Failed to create admin task:", error);
    alert(error.message);
  } finally {
    setAdminTaskSaving(false);
  }
};

const handleAdminTaskAssignment = async (taskId, userId) => {
  const token = localStorage.getItem("token");

  if (!token || !userId) {
    return;
  }

  try {
    await reassignAdminTask(
      token,
      taskId,
      Number(userId)
    );

    await loadAdminTasks(token);
    await loadAdminDashboard(token);
    await loadAdminUsers(token);

    if (selectedAdminUser) {
      await loadAdminUserDetails(selectedAdminUser);
    }
  } catch (error) {
    console.error("Failed to reassign task:", error);
    alert(error.message);
  }
};

const loadAdminUserDetails = async (userId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return;
  }

  setAdminUserDetailsLoading(true);
  setAdminUserHistoryLoading(true);

  try {
    const [details, history] = await Promise.all([
      getAdminUserDetails(token, userId),
      getAdminUserHistory(token, userId),
    ]);

    setAdminUserDetails(details);
    setAdminUserHistory(history);
    setAdminMessages([]);
    setSelectedAdminUser(userId);

    await loadAdminMessages(userId);
  } catch (error) {
    console.error("Failed to load user details:", error);
  } finally {
    setAdminUserDetailsLoading(false);
    setAdminUserHistoryLoading(false);
  }
};

const loadAdminMessages = async (userId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return;
  }

  setAdminMessagesLoading(true);

  try {
    const data = await getMessages(token, userId);
    setAdminMessages(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Failed to load messages:", error);
    setAdminMessages([]);
  } finally {
    setAdminMessagesLoading(false);
  }
};

const handleAdminOpenChat = async () => {
  setShowAdminChat(true);

  const token = localStorage.getItem("token");

  if (!token || !selectedAdminUser) {
    return;
  }

  try {
    await markMessagesRead(token, selectedAdminUser);

    setAdminMessages((messages) =>
      messages.map((message) =>
        message.receiver_id === user.id
          ? { ...message, is_read: 1 }
          : message
      )
    );
  } catch (error) {
    console.error("Failed to mark messages as read:", error);
  }
};

const handleUserOpenChat = async () => {
  setShowUserChat(true);

  const token = localStorage.getItem("token");

  if (!token || !user) {
    return;
  }

  try {
    await markMessagesRead(token, user.id);

    setUserMessages((messages) =>
      messages.map((message) =>
        message.receiver_id === user.id
          ? { ...message, is_read: 1 }
          : message
      )
    );
  } catch (error) {
    console.error("Failed to mark user messages as read:", error);
  }
};

const loadUserMessages = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return;
  }

  setUserMessagesLoading(true);

  try {
    const data = await getMessages(token, user.id);

    setUserMessages(Array.isArray(data) ? data : []);

  } catch (error) {
    console.error("Failed to load user messages:", error);
    setUserMessages([]);
  } finally {
    setUserMessagesLoading(false);
  }
};

const handleUserSendMessage = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  const trimmedMessage = userMessageText.trim();

  if (!token || !trimmedMessage) {
    return;
  }

  setUserMessageSending(true);

  try {
    await sendMessage(token, user.id, trimmedMessage);

    setUserMessageText("");

    await loadUserMessages();
  } catch (error) {
    console.error("Failed to send user message:", error);
    alert(error.message);
  } finally {
    setUserMessageSending(false);
  }
};

const handleAdminSendMessage = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  const trimmedMessage = adminMessageText.trim();

  if (!token || !selectedAdminUser || !trimmedMessage) {
    return;
  }

  setAdminMessageSending(true);

  try {
    await sendMessage(
      token,
      selectedAdminUser,
      trimmedMessage
    );

    setAdminMessageText("");

    await loadAdminMessages(selectedAdminUser);
  } catch (error) {
    console.error("Failed to send message:", error);
    alert(error.message);
  } finally {
    setAdminMessageSending(false);
  }
};

const handleAdminPriorityChange = async (taskId, priority) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return;
  }

  try {
    await updateAdminTaskPriority(token, taskId, priority);

    setAdminUserDetails((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === taskId
          ? { ...task, priority }
          : task
      ),
    }));
  } catch (error) {
    console.error("Failed to update task priority:", error);
    alert(error.message);
  }
};

const handleAdminDeleteTask = async (taskId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return;
  }

  try {
    await deleteAdminTask(token, taskId);

    await loadAdminUserDetails(selectedAdminUser);
    await loadAdminDashboard(token);
  } catch (error) {
    console.error(
      "Failed to delete task as admin:",
      error
    );

    alert(error.message);
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
    const trimmedTitle = taskTitle.trim();
const trimmedDescription = taskDescription.trim();

if (taskDueDate) {
  const today = new Date().toISOString().split("T")[0];

  if (taskDueDate < today) {
    alert("Due date cannot be in the past.");
    setTaskLoading(false);
    return;
  }
}

if (!trimmedTitle) {
  alert("Task title cannot be empty.");
  setTaskLoading(false);
  return;
}

if (trimmedTitle.length > 100) {
  alert("Task title cannot exceed 100 characters.");
  setTaskLoading(false);
  return;
}

if (trimmedDescription.length > 500) {
  alert("Task description cannot exceed 500 characters.");
  setTaskLoading(false);
  return;
}

const taskData = {
  title: trimmedTitle,
  description: trimmedDescription,
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
  await loadNotifications();

  if (data.user.role === "admin") {
    await loadAdminDashboard(data.token);
    await loadAdminUsers(data.token);
    await loadAdminTasks(data.token);
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

if (data.message === "Email already registered") {
  setMessage("");
  setShowDuplicateEmailModal(true);
  return;
}

setMessage(
  data.message || "Registration successful!"
);

if (data.message === "OTP sent to your email") {
  setOtpEmail(email);
  setOtp("");
  setOtpMessage("");
  setResendCooldown(15);
  setShowOtpModal(true);
}
      }
    } catch (error) {
  console.error(error);

  if (
    !isLogin &&
    error.message === "Email already registered"
  ) {
    setShowDuplicateEmailModal(true);
    return;
  }

  setMessage(
    "Something went wrong. Please try again."
  );
} finally {
  setLoading(false);
}
  };
  const handleVerifyOtp = async () => {
  if (otp.length !== 6) {
    setOtpMessage("Please enter the 6-digit OTP.");
    return;
  }

  setOtpLoading(true);
  setOtpMessage("");

  try {
    const data = await verifyOtp(otpEmail, otp);

    setShowOtpModal(false);
setOtp("");
setOtpEmail("");
setOtpMessage("");

setShowVerificationSuccess(true);
  } catch (error) {
    setOtpMessage(error.message);
  } finally {
    setOtpLoading(false);
  }
};

const handleResendOtp = async () => {
  if (resendCooldown > 0 || resendLoading) {
    return;
  }

  setResendLoading(true);
  setOtpMessage("");

  try {
    const data = await resendOtp(otpEmail);

    setOtp("");
    setOtpMessage(data.message);
    setResendCooldown(15);
  } catch (error) {
    setOtpMessage(error.message);
  } finally {
    setResendLoading(false);
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

  setDeleteLoading(true);

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
  } finally {
    setDeleteLoading(false);
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
  setNotifications([]);
  setNotificationCount(0);
  setShowNotifications(false);
  notificationCountRef.current = null;
  setNotificationToast(null);

  // Authentication
  setUser(null);
  setIsLogin(true);

  // User tasks
  setTasks([]);
  setTasksLoading(true);

  // Admin dashboard
  setAdminData(null);
  setAdminUsers([]);
  setAdminTasks([]);
  setAdminUsersLoading(false);
  setAdminTasksLoading(false);
  setAdminLoading(false);

  // Admin selected-user state
  setSelectedAdminUser(null);
  setAdminUserDetails(null);
  setAdminUserHistory([]);
  setAdminUserDetailsLoading(false);
  setAdminUserHistoryLoading(false);

  // Messaging
  setAdminMessages([]);
  setUserMessages([]);
  setAdminMessageText("");
  setUserMessageText("");
  setShowAdminChat(false);
  setShowUserChat(false);

  // Task forms
  setShowTaskForm(false);
  setEditingTask(null);
  setTaskToDelete(null);
  setAdminTaskToDelete(null);

  // Admin task form
  setShowAdminTaskForm(false);
  setAdminTaskTitle("");
  setAdminTaskDescription("");
  setAdminTaskStatus("pending");
  setAdminTaskPriority("medium");
  setAdminTaskDueDate("");
  setAdminTaskAssignee("");

  // Auth form
  setName("");
  setEmail("");
  setPassword("");
  setMessage("");
};

  useEffect(() => {
  if (user && user.role === "user") {
    loadUserMessages();
  }
}, [user]);

  const notificationUI = (
  <div className="notification-wrapper">
    <button
      type="button"
      className="notification-button"
      onClick={async () => {
        const nextState = !showNotifications;

        setShowNotifications(nextState);

        if (nextState) {
          await loadNotifications();
        }
      }}
      aria-label="Notifications"
    >
      <span className="notification-bell">🔔</span>

      {notificationCount > 0 && (
        <span className="notification-badge">
          {notificationCount > 99
            ? "99+"
            : notificationCount}
        </span>
      )}
    </button>

    {showNotifications && (
      <div className="notification-panel">
        <div className="notification-panel-header">
          <div>
            <strong>Notifications</strong>
            <span>
              {notificationCount} unread
            </span>
          </div>

          {notificationCount > 0 && (
            <button
              type="button"
              className="mark-all-read-button"
              onClick={handleMarkAllNotificationsRead}
            >
              Mark all read
            </button>
          )}
        </div>

        <div className="notification-list">
          {notificationsLoading ? (
            <div className="notification-empty">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="notification-empty">
              No notifications yet.
            </div>
          ) : (
            notifications.map((notification) => (
              <button
                type="button"
                key={notification.id}
                className={`notification-item ${
                  Number(notification.is_read) === 0
                    ? "unread"
                    : "read"
                }`}
                onClick={() =>
                  handleNotificationClick(notification)
                }
              >
                <div className="notification-item-icon">
                  {notification.type === "message"
                    ? "✉"
                    : "•"}
                </div>

                <div className="notification-item-content">
                  <strong>
                    {notification.title}
                  </strong>

                  <p>
                    {notification.message}
                  </p>

                  <span>
                    {new Date(
                      notification.created_at
                    ).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    )}
    {notificationToast && (
  <div
    className="notification-toast"
    onClick={() => {
      setShowNotifications(true);
      handleNotificationClick(notificationToast);
      setNotificationToast(null);
    }}
  >
    <div className="notification-toast-icon">
      {notificationToast.type === "message"
        ? "✉"
        : "•"}
    </div>

    <div className="notification-toast-content">
      <strong>
        {notificationToast.title}
      </strong>

      <span>
        {notificationToast.message}
      </span>
    </div>

    <button
      type="button"
      className="notification-toast-close"
      onClick={(e) => {
        e.stopPropagation();
        setNotificationToast(null);
      }}
      aria-label="Close notification"
    >
      ×
    </button>
  </div>
)}
  </div>
);

if (user && user.role === "admin") {
  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Cloud Task Manager</h1>
          <p>Admin Dashboard</p>
        </div>

        <div className="dashboard-header-actions">
  {notificationUI}

  <button
    className="logout-button"
    onClick={handleLogout}
  >
    Logout
  </button>
</div>
      </header>

      {selectedAdminUser && adminUserDetails ? (
  <section className="dashboard-content admin-user-page">

    <button
      className="admin-back-button"
      onClick={() => {
        setSelectedAdminUser(null);
        setAdminUserDetails(null);
        setAdminUserHistory([]);
        setAdminMessages([]);
      }}
    >
      ← Back to Users
    </button>

    <section className="admin-user-header">
      <div>
        <h2>{adminUserDetails.user.name}</h2>
        <p>{adminUserDetails.user.email}</p>
      </div>

      <span className={`admin-role ${adminUserDetails.user.role}`}>
        {adminUserDetails.user.role}
      </span>
    </section>

    <section className="admin-section">
      <div className="admin-section-header">
        <div>
          <h2>Task Overview</h2>
          <p>Current task activity for this user.</p>
        </div>
      </div>

      <div className="admin-task-overview">
        <div className="admin-task-stat">
          <span>Total Tasks</span>
          <strong>{adminUserDetails.tasks.length}</strong>
        </div>

        <div className="admin-task-stat pending">
          <span>Pending</span>
          <strong>
            {
              adminUserDetails.tasks.filter(
                (task) => task.status === "pending"
              ).length
            }
          </strong>
        </div>

        <div className="admin-task-stat progress">
          <span>In Progress</span>
          <strong>
            {
              adminUserDetails.tasks.filter(
                (task) => task.status === "in_progress"
              ).length
            }
          </strong>
        </div>

        <div className="admin-task-stat completed">
          <span>Completed</span>
          <strong>
            {
              adminUserDetails.tasks.filter(
                (task) => task.status === "completed"
              ).length
            }
          </strong>
        </div>
      </div>
    </section>

    {!showAdminChat && (
  <button
  type="button"
  className="admin-chat-launcher"
  onClick={handleAdminOpenChat}
>
  {adminMessages.some(
    (message) =>
      message.receiver_id === user.id &&
      message.is_read === 0
  ) && (
    <span className="admin-chat-launcher-dot"></span>
  )}

  Messages
</button>
)}

{showAdminChat && (
  <div className="admin-chat-widget">
    <div className="admin-chat-header">
      <div>
        <strong>{adminUserDetails.user.name}</strong>
        <span>Direct messages</span>
      </div>

      <button
        type="button"
        className="admin-chat-close"
        onClick={() => setShowAdminChat(false)}
        aria-label="Close messages"
      >
        ×
      </button>
    </div>

    <div className="admin-chat-list">
      {adminMessagesLoading ? (
        <div className="admin-chat-empty">
          Loading messages...
        </div>
      ) : adminMessages.length === 0 ? (
        <div className="admin-chat-empty">
          No messages yet.
          <span>Start a conversation with this user.</span>
        </div>
      ) : (
        adminMessages.map((msg) => {
          const isAdminMessage = msg.sender_id === user.id;

          return (
            <div
              key={msg.id}
              className={`admin-chat-message ${
                isAdminMessage
                  ? "admin-chat-message-sent"
                  : "admin-chat-message-received"
              }`}
            >
              <div className="admin-chat-bubble">
                <p>{msg.message}</p>

                <span>
  {new Date(msg.created_at).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}

  {isAdminMessage && (
    <span className={`admin-chat-read-status ${msg.is_read ? "read" : ""}`}>
      {msg.is_read ? "Read" : "Sent"}
    </span>
  )}
</span>
              </div>
            </div>
          );
        })
      )}
    </div>

    <form
      className="admin-chat-form"
      onSubmit={handleAdminSendMessage}
    >
      <input
        type="text"
        value={adminMessageText}
        onChange={(e) => setAdminMessageText(e.target.value)}
        placeholder="Type a message..."
        maxLength={1000}
        disabled={adminMessageSending}
      />

      <button
        type="submit"
        disabled={
          adminMessageSending ||
          !adminMessageText.trim()
        }
      >
        {adminMessageSending ? "..." : "Send"}
      </button>
    </form>
  </div>
)}

    <section className="admin-section admin-user-tasks">
      <div className="admin-section-header">
        <div>
          <h2>Tasks</h2>
          <p>
            Tasks created by {adminUserDetails.user.name}.
          </p>
        </div>
      </div>

      {adminUserDetails.tasks.length === 0 ? (
        <div className="admin-empty-state">
          <h3>No tasks yet</h3>
          <p>
            This user has not created any tasks.
          </p>
        </div>
      ) : (
        <div className="admin-users-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {adminUserDetails.tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>
  {task.status === "in_progress"
    ? "In Progress"
    : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
</td>
<td>
  <select
    className={`admin-priority-select ${task.priority}`}
    value={task.priority || "medium"}
    onChange={(e) =>
      handleAdminPriorityChange(task.id, e.target.value)
    }
  >
    <option value="low">LOW</option>
    <option value="medium">MEDIUM</option>
    <option value="high">HIGH</option>
  </select>
</td>
                  <td>{task.due_date || "—"}</td>
                  <td>{task.created_at}</td>
                  <td>
    <button
      type="button"
      className="admin-delete-task-button"
      onClick={() => setAdminTaskToDelete(task)}
    >
      Delete
    </button>
  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
    <section className="admin-section admin-user-history">
  <div className="admin-section-header">
    <div>
      <h2>Activity History</h2>
      <p>Task activity and changes made by this user.</p>
    </div>
  </div>

  {adminUserHistoryLoading ? (
    <div className="admin-empty-state">
      <p>Loading activity history...</p>
    </div>
  ) : adminUserHistory.length === 0 ? (
    <div className="admin-empty-state">
      <h3>No activity yet</h3>
      <p>This user has no recorded task activity.</p>
    </div>
  ) : (
    <div className="admin-history-list">
      {adminUserHistory.map((entry) => {
  let details = {};

  try {
    details =
      typeof entry.details === "string"
        ? JSON.parse(entry.details)
        : entry.details || {};
  } catch {
    details = {};
  }

  const isDeleted = entry.action === "TASK_DELETED";

  return (
    <div
      className={`admin-history-item ${
        isDeleted ? "admin-history-item-deleted" : ""
      }`}
      key={entry.id}
    >
      <div className="admin-history-marker"></div>

      <div className="admin-history-content">
        <div className="admin-history-top">
          <div className="admin-history-title">
            <strong>
              {isDeleted
                ? details.title || `Task #${entry.task_id}`
                : entry.task_title || `Task #${entry.task_id}`}
            </strong>

            <span className={`admin-history-action ${entry.action}`}>
              {isDeleted
                ? "Deleted"
                : entry.action.replace("_", " ")}
            </span>
          </div>

          <span className="admin-history-date">
            {entry.created_at}
          </span>
        </div>

        {isDeleted ? (
          <div className="admin-history-details">
            <div className="admin-history-task-info">
              <div>
                <span>Status</span>
                <strong className={`history-status ${details.status || ""}`}>
                  {details.status === "in_progress"
                    ? "In Progress"
                    : details.status
                      ? details.status.charAt(0).toUpperCase() +
                        details.status.slice(1)
                      : "—"}
                </strong>
              </div>

              <div>
                <span>Priority</span>
                <strong
                  className={`history-priority ${details.priority || ""}`}
                >
                  {details.priority
                    ? details.priority.charAt(0).toUpperCase() +
                      details.priority.slice(1)
                    : "—"}
                </strong>
              </div>

              <div>
                <span>Due Date</span>
                <strong>{details.due_date || "—"}</strong>
              </div>

              <div>
                <span>Action</span>
                <strong className="history-action-text">
                  Task removed
                </strong>
              </div>
            </div>
          </div>
        ) : (
          <p>{entry.details}</p>
        )}
      </div>
    </div>
  );
})}
    </div>
  )}
</section>

  </section>

) : (

      <section className="dashboard-content">
        <div className="section-heading">
          <div>
            <h2>Overview</h2>
            <p>Monitor application activity and manage your platform.</p>
          </div>
        </div>

        <div className="task-stats">
          <div className="stat-card">
            <span className="stat-label">Total Users</span>
            <strong>
              {adminData?.statistics?.totalUsers ?? "-"}
            </strong>
          </div>

          <div className="stat-card">
            <span className="stat-label">Total Tasks</span>
            <strong>
              {adminData?.statistics?.totalTasks ?? "-"}
            </strong>
          </div>

          <div className="stat-card">
            <span className="stat-label">Pending Tasks</span>
            <strong>
              {adminData?.statistics?.pendingTasks ?? "-"}
            </strong>
          </div>

          <div className="stat-card">
            <span className="stat-label">Completed Tasks</span>
            <strong>
              {adminData?.statistics?.completedTasks ?? "-"}
            </strong>
          </div>
        </div>

        <section className="admin-section">
  <div className="admin-section-header">
  <div>
    <h2>User Management</h2>
    <p>
      View and manage registered users.
    </p>
  </div>

  <button
    type="button"
    className="refresh-admin-users-button"
    onClick={() => {
      const token = localStorage.getItem("token");

      if (token) {
        loadAdminUsers(token);
      }
    }}
    disabled={adminUsersLoading}
  >
    {adminUsersLoading ? "Refreshing..." : "↻ Refresh"}
  </button>
</div>

  {adminUsersLoading ? (
    <p className="admin-table-message">Loading users...</p>
  ) : adminUsers.length === 0 ? (
    <p className="admin-table-message">No users found.</p>
  ) : (
    <div className="admin-users-table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Total Tasks</th>
            <th>Pending</th>
            <th>In Progress</th>
            <th>Completed</th>
            <th>Last Login</th>
          </tr>
        </thead>

        <tbody>
          {adminUsers.map((adminUser) => (
            <tr key={adminUser.id}>
              <td>
  <button
    className="admin-user-name"
    onClick={() => loadAdminUserDetails(adminUser.id)}
  >
    {adminUser.name}
  </button>
</td>
              <td>{adminUser.email}</td>
              <td>
                <span
                  className={`admin-role ${adminUser.role}`}
                >
                  {adminUser.role}
                </span>
              </td>
              <td>{adminUser.created_at}</td>
              <td>{adminUser.total_tasks}</td>
              <td>{adminUser.pending_tasks}</td>
              <td>{adminUser.in_progress_tasks}</td>
              <td>{adminUser.completed_tasks}</td>
<td>
  {adminUser.last_login
    ? new Date(adminUser.last_login).toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "Never"}
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</section>
<section className="admin-section admin-task-management">
  <div className="admin-section-header">
    <div>
      <h2>Task Management</h2>
      <p>Create tasks and assign them to specific users.</p>
    </div>

    <div className="admin-task-management-actions">
      <button
        type="button"
        className="refresh-admin-users-button"
        onClick={() => {
          const token = localStorage.getItem("token");

          if (token) {
            loadAdminTasks(token);
          }
        }}
        disabled={adminTasksLoading}
      >
        {adminTasksLoading ? "Refreshing..." : "↻ Refresh"}
      </button>

      <button
        type="button"
        className="new-task-button"
        onClick={() => setShowAdminTaskForm(true)}
      >
        + Create Task
      </button>
    </div>
  </div>

  {showAdminTaskForm && (
    <div className="admin-task-form-card">
      <div className="task-form-header">
        <div>
          <h2>Create Task</h2>
          <p>Create a task and assign it to a user.</p>
        </div>

        <button
          type="button"
          className="close-task-button"
          onClick={() => setShowAdminTaskForm(false)}
        >
          ×
        </button>
      </div>

      <form onSubmit={handleAdminCreateTask}>
        <div className="task-input-group">
          <label>Task title</label>

          <input
            type="text"
            value={adminTaskTitle}
            onChange={(e) =>
              setAdminTaskTitle(e.target.value)
            }
            placeholder="e.g. Configure AWS deployment"
            maxLength={100}
            required
          />
        </div>

        <div className="task-input-group">
          <label>Description</label>

          <textarea
            value={adminTaskDescription}
            onChange={(e) =>
              setAdminTaskDescription(e.target.value)
            }
            placeholder="Describe what needs to be done..."
            rows="4"
            maxLength={500}
          />
        </div>

        <div className="admin-task-form-grid">
          <div className="task-input-group">
            <label>Assign to</label>

            <select
              value={adminTaskAssignee}
              onChange={(e) =>
                setAdminTaskAssignee(e.target.value)
              }
              required
            >
              <option value="">
                Select a user
              </option>

              {adminUsers
                .filter((item) => item.role === "user")
                .map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name} — {item.email}
                  </option>
                ))}
            </select>
          </div>

          <div className="task-input-group">
            <label>Status</label>

            <select
              value={adminTaskStatus}
              onChange={(e) =>
                setAdminTaskStatus(e.target.value)
              }
            >
              <option value="pending">
                Pending
              </option>
              <option value="in_progress">
                In Progress
              </option>
              <option value="completed">
                Completed
              </option>
            </select>
          </div>

          <div className="task-input-group">
            <label>Priority</label>

            <select
              value={adminTaskPriority}
              onChange={(e) =>
                setAdminTaskPriority(e.target.value)
              }
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="task-input-group">
            <label>Due date</label>

            <input
              type="date"
              value={adminTaskDueDate}
              onChange={(e) =>
                setAdminTaskDueDate(e.target.value)
              }
            />
          </div>
        </div>

        <div className="task-form-actions">
          <button
            type="button"
            className="cancel-task-button"
            onClick={() =>
              setShowAdminTaskForm(false)
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button create-task-submit"
            disabled={adminTaskSaving}
          >
            {adminTaskSaving
              ? "Creating..."
              : "Create task →"}
          </button>
        </div>
      </form>
    </div>
  )}

  {adminTasksLoading ? (
    <div className="admin-empty-state">
      <p>Loading tasks...</p>
    </div>
  ) : adminTasks.length === 0 ? (
    <div className="admin-empty-state">
      <h3>No tasks found</h3>
      <p>Create a task and assign it to a user.</p>
    </div>
  ) : (
    <div className="admin-users-table admin-task-management-table">
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Assigned User</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>
          {adminTasks.map((task) => (
            <tr key={task.id}>
              <td>
                <div className="admin-task-name-cell">
                  <strong>{task.title}</strong>

                  {task.description && (
                    <span>{task.description}</span>
                  )}
                </div>
              </td>

              <td>
                <select
                  className="admin-assignee-select"
                  value={task.user_id}
                  onChange={(e) =>
                    handleAdminTaskAssignment(
                      task.id,
                      e.target.value
                    )
                  }
                >
                  {adminUsers
                    .filter(
                      (item) =>
                        item.role === "user"
                    )
                    .map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.name}
                      </option>
                    ))}
                </select>
              </td>

              <td>
                <span
                  className={`status ${task.status}`}
                >
                  <span className="status-dot"></span>
                  {task.status === "in_progress"
                    ? "In Progress"
                    : task.status.charAt(0).toUpperCase() +
                      task.status.slice(1)}
                </span>
              </td>

              <td>
                <span
                  className={`task-priority ${task.priority}`}
                >
                  {task.priority.toUpperCase()}
                </span>
              </td>

              <td>
                {task.due_date || "—"}
              </td>

              <td>
                {task.created_at}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</section>
      </section>
)}
{adminTaskToDelete && (
  <div
    className="modal-overlay"
    onClick={() => setAdminTaskToDelete(null)}
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
        <strong>{adminTaskToDelete.title}</strong>?
        This will permanently remove the task
        from this user's account.
      </p>

      <div className="delete-modal-actions">
        <button
          type="button"
          className="cancel-delete-button"
          onClick={() =>
            setAdminTaskToDelete(null)
          }
        >
          Cancel
        </button>

        <button
          type="button"
          className="confirm-delete-button"
          onClick={async () => {
            await handleAdminDeleteTask(
              adminTaskToDelete.id
            );

            setAdminTaskToDelete(null);
          }}
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

  if (user) {
    return (
      <main className="dashboard">
        <header className="dashboard-header">
          <div>
            <h1>Cloud Task Manager</h1>
            <p>Welcome back, {user.name}</p>
          </div>

          <div className="dashboard-header-actions">
  {notificationUI}

  <button
    className="logout-button"
    onClick={handleLogout}
  >
    Logout
  </button>
</div>
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
                    maxLength={100}
                    required
                  />
                  <div className="character-counter">
  {taskTitle.length}/100
</div>
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
                    maxLength={500}
                  ></textarea>
                  <div className="character-counter">
  {taskDescription.length}/500
</div>
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

{task.priority && (
  <span className={`task-priority ${task.priority}`}>
    {task.priority.toUpperCase()} PRIORITY
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
  disabled={deleteLoading}
>
  {deleteLoading ? "Deleting..." : "Delete task"}
</button>
              </div>
            </div>
          </div>
        )}

        {!showUserChat && (
  <button
  type="button"
  className="admin-chat-launcher"
  onClick={handleUserOpenChat}
>
  {userMessages.some(
    (message) =>
      message.receiver_id === user.id &&
      message.is_read === 0
  ) && (
    <span className="admin-chat-launcher-dot"></span>
  )}

  Messages
</button>
)}

{showUserChat && (
  <div className="admin-chat-widget">
    <div className="admin-chat-header">
      <div>
        <strong>Administrator</strong>
        <span>Direct messages</span>
      </div>

      <button
        type="button"
        className="admin-chat-close"
        onClick={() => setShowUserChat(false)}
        aria-label="Close messages"
      >
        ×
      </button>
    </div>

    <div className="admin-chat-list">
      {userMessagesLoading ? (
        <div className="admin-chat-empty">
          Loading messages...
        </div>
      ) : userMessages.length === 0 ? (
        <div className="admin-chat-empty">
          No messages yet.
          <span>Send a message to the administrator.</span>
        </div>
      ) : (
        userMessages.map((msg) => {
          const isUserMessage = msg.sender_id === user.id;

          return (
            <div
              key={msg.id}
              className={`admin-chat-message ${
                isUserMessage
                  ? "admin-chat-message-sent"
                  : "admin-chat-message-received"
              }`}
            >
              <div className="admin-chat-bubble">
                <p>{msg.message}</p>

                <span>
  {new Date(msg.created_at).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}

  {isUserMessage && (
    <span className={`admin-chat-read-status ${msg.is_read ? "read" : ""}`}>
      {msg.is_read ? "Read" : "Sent"}
    </span>
  )}
</span>
              </div>
            </div>
          );
        })
      )}
    </div>

    <form
      className="admin-chat-form"
      onSubmit={handleUserSendMessage}
    >
      <input
        type="text"
        value={userMessageText}
        onChange={(e) => setUserMessageText(e.target.value)}
        placeholder="Message the administrator..."
        maxLength={1000}
        disabled={userMessageSending}
      />

      <button
        type="submit"
        disabled={
          userMessageSending ||
          !userMessageText.trim()
        }
      >
        {userMessageSending ? "..." : "Send"}
      </button>
    </form>
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
      {showOtpModal && (
  <div className="otp-modal-overlay">
    <div className="otp-modal">
      <button
        type="button"
        className="otp-close-button"
        onClick={() => setShowOtpModal(false)}
      >
        ×
      </button>

      <div className="otp-modal-icon">✉</div>

      <h2>Verify your email</h2>

      <p>
        We sent a 6-digit verification code to
        <strong>{otpEmail}</strong>
      </p>

      <div className="otp-input-group">
        <label htmlFor="otp">Verification code</label>

        <input
          id="otp"
          type="text"
          inputMode="numeric"
          maxLength="6"
          placeholder="000000"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, ""))
          }
        />
      </div>

      {otpMessage && (
        <div className="otp-message">
          {otpMessage}
        </div>
      )}

      <button
        type="button"
        className="primary-button otp-verify-button"
        onClick={handleVerifyOtp}
        disabled={otpLoading}
      >
        {otpLoading ? "Verifying..." : "Verify email →"}
      </button>

      <p className="otp-helper">
        Enter the code sent to your email. The code expires in 10 minutes.
      </p>
      <div className="otp-resend-section">
  <span>Didn't receive the code?</span>

  <button
    type="button"
    className="otp-resend-button"
    onClick={handleResendOtp}
    disabled={resendLoading || resendCooldown > 0}
  >
    {resendLoading
      ? "Sending..."
      : resendCooldown > 0
      ? `Resend in ${resendCooldown}s`
      : "Resend OTP"}
  </button>
</div>
    </div>
  </div>
)} 

{showVerificationSuccess && (
  <div className="otp-modal-overlay">
    <div className="otp-modal verification-success-modal">

      <div className="verification-success-icon">
        ✓
      </div>

      <h2>Email verified</h2>

      <p>
        Your email has been successfully verified.
        <strong>You can now sign in to your account.</strong>
      </p>

      <button
        type="button"
        className="primary-button otp-verify-button"
        onClick={() => {
          setShowVerificationSuccess(false);
          setIsLogin(true);
          setName("");
          setEmail("");
          setPassword("");
          setMessage("");
        }}
      >
        Continue to Sign In →
      </button>

    </div>
  </div>
)}

{showDuplicateEmailModal && (
  <div className="otp-modal-overlay">
    <div className="otp-modal verification-success-modal">

      <button
        type="button"
        className="otp-close-button"
        onClick={() => setShowDuplicateEmailModal(false)}
      >
        ×
      </button>

      <div className="verification-success-icon">
        !
      </div>

      <h2>Email already registered</h2>

      <p>
        This email is already associated with an account.
        <strong>
          Please try another email or proceed with login.
        </strong>
      </p>

      <button
        type="button"
        className="primary-button otp-verify-button"
        onClick={() => {
          setShowDuplicateEmailModal(false);
          setIsLogin(true);
          setName("");
          setPassword("");
          setMessage("");
        }}
      >
        Proceed to Sign In →
      </button>

      <button
        type="button"
        className="otp-resend-button duplicate-email-secondary-button"
        onClick={() => {
          setShowDuplicateEmailModal(false);
          setEmail("");
          setPassword("");
          setMessage("");
        }}
      >
        Try another email
      </button>

    </div>
  </div>
)}

    </main>
  );
}

export default App;
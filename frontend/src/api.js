const API_URL = "http://localhost:5000/api";

export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return response.json();
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  return response.json();
}

export async function getTasks(token) {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return response.json();
}

export async function createTask(token, taskData) {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });

  const text = await response.text();

  console.log("Create task status:", response.status);
  console.log("Create task response:", text);

  if (!response.ok) {
    throw new Error(
      `Server returned ${response.status}: ${text}`
    );
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `Server returned non-JSON response: ${text}`
    );
  }
}

export async function updateTask(token, taskId, taskData) {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update task");
  }

  return data;
}

export async function deleteTask(token, taskId) {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete task");
  }

  return data;
}

export async function getAdminDashboard(token) {
  const response = await fetch(`${API_URL}/admin/dashboard`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load admin dashboard");
  }

  return data;
}

export async function getAdminUsers(token) {
  const response = await fetch(`${API_URL}/admin/users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load users");
  }

  return data;
}

export async function getAdminUserDetails(token, userId) {
  const response = await fetch(
    `${API_URL}/admin/users/${userId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to load user details"
    );
  }

  return data;
}

export async function getAdminUserHistory(token, userId) {
  const response = await fetch(
    `${API_URL}/admin/users/${userId}/history`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to load task history"
    );
  }

  return data;
}

export async function updateAdminTaskPriority(token, taskId, priority) {
  const response = await fetch(
    `${API_URL}/admin/tasks/${taskId}/priority`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        priority,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update task priority"
    );
  }

  return data;
}

export async function getAdminTasks(token) {
  const response = await fetch(`${API_URL}/admin/tasks`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to load admin tasks"
    );
  }

  return data;
}

export async function createAdminTask(token, taskData) {
  const response = await fetch(`${API_URL}/admin/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create task"
    );
  }

  return data;
}

export async function reassignAdminTask(
  token,
  taskId,
  userId
) {
  const response = await fetch(
    `${API_URL}/admin/tasks/${taskId}/assign`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: userId,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to reassign task"
    );
  }

  return data;
}

export async function verifyOtp(email, otp) {
  const response = await fetch(`${API_URL}/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      otp,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "OTP verification failed");
  }

  return data;
}

export async function resendOtp(email) {
  const response = await fetch(`${API_URL}/auth/resend-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to resend OTP");
  }

  return data;
}

export async function deleteAdminTask(token, taskId) {
  const response = await fetch(
    `${API_URL}/admin/tasks/${taskId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete task"
    );
  }

  return data;
}

export async function getMessages(token, userId) {
  const response = await fetch(
    `${API_URL}/messages/${userId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to load messages"
    );
  }

  return data;
}

export async function sendMessage(token, userId, message) {
  const response = await fetch(
    `${API_URL}/messages/${userId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to send message"
    );
  }

  return data;
}

export async function markMessagesRead(token, userId) {
  const response = await fetch(
    `${API_URL}/messages/${userId}/read`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to mark messages as read"
    );
  }

  return data;
}
// ============================================
// BIGGY FLIX - Authentication System
// ============================================
// This script handles both Sign Up and Login functionality
// Uses localStorage for user registration and sessionStorage for login state

// ============================================
// STORAGE MANAGEMENT FUNCTIONS
// ============================================

/**
 * Get all registered users from localStorage
 * @returns {Array} Array of registered users
 */
function getAllUsers() {
  const users = localStorage.getItem("biggyflix_users");
  return users ? JSON.parse(users) : [];
}

/**
 * Save users array to localStorage
 * @param {Array} users - Array of user objects
 */
function saveUsers(users) {
  localStorage.setItem("biggyflix_users", JSON.stringify(users));
}

/**
 * Check if email already exists in localStorage
 * @param {String} email - Email to check
 * @returns {Boolean} True if email exists
 */
function emailExists(email) {
  const users = getAllUsers();
  return users.some((user) => user.email.toLowerCase() === email.toLowerCase());
}

/**
 * Find user by email and password
 * @param {String} email - User email
 * @param {String} password - User password
 * @returns {Object|null} User object if found, null otherwise
 */
function findUser(email, password) {
  const users = getAllUsers();
  return (
    users.find(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password,
    ) || null
  );
}

/**
 * Get current logged in user from sessionStorage
 * @returns {Object|null} User object or null
 */
function getCurrentUser() {
  const userJson = sessionStorage.getItem("loggedInUser");
  return userJson ? JSON.parse(userJson) : null;
}

/**
 * Check if current user is admin
 * @returns {Boolean} True if user is admin
 */
function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === "admin";
}

/**
 * Redirect user based on role
 * @param {Object} user - User object
 */
function redirectBasedOnRole(user) {
  if (user.role === "admin") {
    window.location.href = "admin.html";
  } else {
    window.location.href = "profile.html";
  }
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validate email format
 * @param {String} email - Email to validate
 * @returns {Boolean} True if valid email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength (minimum 8 characters)
 * @param {String} password - Password to validate
 * @returns {Boolean} True if password meets requirements
 */
function isValidPassword(password) {
  return password.length >= 8;
}

// ============================================
// INITIALIZE DEFAULT USERS
// ============================================

/**
 * Initialize default admin and sample users if no users exist
 */
function initializeDefaultUsers() {
  const users = getAllUsers();

  // Only initialize if no users exist
  if (users.length === 0) {
    console.log("No users found - creating default users");

    // Create default admin user
    const adminUser = {
      id: 1,
      fullname: "System Administrator",
      email: "admin@biggyflix.com",
      password: "admin123",
      role: "admin",
      plan: "premium",
      status: "active",
      createdAt: new Date().toISOString(),
    };

    // Create sample users
    const sampleUsers = [
      {
        id: 2,
        fullname: "Ana Santos",
        email: "ana@email.com",
        password: "password123",
        role: "admin",
        plan: "premium",
        status: "active",
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        fullname: "Juan Dela Cruz",
        email: "juan@email.com",
        password: "password123",
        role: "user",
        plan: "standard",
        status: "active",
        createdAt: new Date().toISOString(),
      },
      {
        id: 4,
        fullname: "Maria Reyes",
        email: "maria@email.com",
        password: "password123",
        role: "moderator",
        plan: "premium",
        status: "active",
        createdAt: new Date().toISOString(),
      },
      {
        id: 5,
        fullname: "John Smith",
        email: "john@email.com",
        password: "password123",
        role: "user",
        plan: "basic",
        status: "active",
        createdAt: new Date().toISOString(),
      },
      {
        id: 6,
        fullname: "Sarah Johnson",
        email: "sarah@email.com",
        password: "password123",
        role: "user",
        plan: "standard",
        status: "suspended",
        createdAt: new Date().toISOString(),
      },
      {
        id: 7,
        fullname: "Mike Chen",
        email: "mike@email.com",
        password: "password123",
        role: "moderator",
        plan: "premium",
        status: "active",
        createdAt: new Date().toISOString(),
      },
    ];

    // Add all users
    users.push(adminUser, ...sampleUsers);
    saveUsers(users);
    console.log("Default users created:", users.length, "users total");
  } else {
    // Ensure all users have IDs (for older data)
    let needsUpdate = false;
    users.forEach((user, index) => {
      if (!user.id) {
        user.id = index + 1;
        needsUpdate = true;
      }
      if (!user.status) {
        user.status = "active";
        needsUpdate = true;
      }
      if (!user.plan) {
        user.plan = "basic";
        needsUpdate = true;
      }
      if (!user.role) {
        user.role = "user";
        needsUpdate = true;
      }
    });

    if (needsUpdate) {
      saveUsers(users);
      console.log("Updated existing users with missing fields");
    }
  }
}

// Initialize default users on script load
initializeDefaultUsers();

// ============================================
// SIGN UP LOGIC
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.querySelector(".signup-box form");
  const signupErrorDiv = document.getElementById("signup-error-message");

  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form inputs
      const fullnameInput = document.querySelector("#fullname");
      const emailInput = document.querySelector("#email");
      const passwordInput = document.querySelector("#password");
      const confirmPasswordInput = document.querySelector("#confirm-password");

      // Get values
      const fullname = fullnameInput?.value.trim() || "";
      const email = emailInput?.value.trim() || "";
      const password = passwordInput?.value || "";
      const confirmPassword = confirmPasswordInput?.value || "";

      // Clear previous error message
      if (signupErrorDiv) {
        signupErrorDiv.textContent = "";
        signupErrorDiv.style.display = "none";
      }

      // ---- VALIDATION ----

      // 1. Check if all fields are filled
      if (!fullname || !email || !password || !confirmPassword) {
        if (signupErrorDiv) {
          signupErrorDiv.textContent =
            "All fields are required. Please fill in all fields.";
          signupErrorDiv.style.display = "block";
          signupErrorDiv.style.color = "#ff006e";
        }
        return;
      }

      // 2. Validate email format
      if (!isValidEmail(email)) {
        if (signupErrorDiv) {
          signupErrorDiv.textContent =
            "Invalid email format. Please enter a valid email address.";
          signupErrorDiv.style.display = "block";
          signupErrorDiv.style.color = "#ff006e";
        }
        emailInput?.focus();
        return;
      }

      // 3. Validate password length
      if (!isValidPassword(password)) {
        if (signupErrorDiv) {
          signupErrorDiv.textContent =
            "Password must be at least 8 characters long.";
          signupErrorDiv.style.display = "block";
          signupErrorDiv.style.color = "#ff006e";
        }
        passwordInput?.focus();
        return;
      }

      // 4. Check if passwords match
      if (password !== confirmPassword) {
        if (signupErrorDiv) {
          signupErrorDiv.textContent =
            "Passwords do not match. Please try again.";
          signupErrorDiv.style.display = "block";
          signupErrorDiv.style.color = "#ff006e";
        }
        confirmPasswordInput?.focus();
        return;
      }

      // 5. Check if email already exists
      if (emailExists(email)) {
        if (signupErrorDiv) {
          signupErrorDiv.textContent =
            "Email already registered. Please use a different email or log in.";
          signupErrorDiv.style.display = "block";
          signupErrorDiv.style.color = "#ff006e";
        }
        emailInput?.focus();
        return;
      }

      // ---- REGISTRATION ----

      // Get all users to determine next ID
      const users = getAllUsers();
      const nextId =
        users.length > 0 ? Math.max(...users.map((u) => u.id || 0)) + 1 : 1;

      // Create new user object (default role is "user")
      const newUser = {
        id: nextId,
        fullname: fullname,
        email: email,
        password: password,
        role: "user", // Default role for new signups
        plan: "basic", // Default plan
        status: "active",
        createdAt: new Date().toISOString(),
      };

      // Add new user to array
      users.push(newUser);

      // Save to localStorage
      saveUsers(users);

      // Success message
      console.log("Registration Successful - New user added:", newUser.email);
      if (signupErrorDiv) {
        signupErrorDiv.textContent =
          "Account created successfully! Redirecting to login page...";
        signupErrorDiv.style.display = "block";
        signupErrorDiv.style.color = "#00d9ff";
      }

      // Redirect to login page
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    });
  }
});

// ============================================
// LOGIN LOGIC
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector(".login-box form");
  const errorMessageDiv = document.getElementById("error-message");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form inputs
      const emailInput = document.querySelector("#email");
      const passwordInput = document.querySelector("#password");

      // Get values
      const email = emailInput?.value.trim() || "";
      const password = passwordInput?.value || "";

      // Clear previous error message
      if (errorMessageDiv) {
        errorMessageDiv.textContent = "";
        errorMessageDiv.style.display = "none";
      }

      // ---- VALIDATION ----

      // 1. Check if fields are filled
      if (!email || !password) {
        if (errorMessageDiv) {
          errorMessageDiv.textContent = "Email and password are required.";
          errorMessageDiv.style.display = "block";
          errorMessageDiv.style.color = "#ff006e";
        }
        return;
      }

      // ---- AUTHENTICATION ----

      // Find user in localStorage
      const user = findUser(email, password);

      if (!user) {
        // Invalid credentials
        console.log("Invalid email or password");
        if (errorMessageDiv) {
          errorMessageDiv.textContent = "Invalid email or password.";
          errorMessageDiv.style.display = "block";
          errorMessageDiv.style.color = "#ff006e";
        }
        // Clear password field for security
        if (passwordInput) passwordInput.value = "";
        return;
      }

      // Check if user is suspended
      if (user.status === "suspended") {
        if (errorMessageDiv) {
          errorMessageDiv.textContent =
            "Your account has been suspended. Please contact support.";
          errorMessageDiv.style.display = "block";
          errorMessageDiv.style.color = "#ff006e";
        }
        return;
      }

      // ---- LOGIN SUCCESS ----

      // Store logged-in user in sessionStorage
      sessionStorage.setItem("loggedInUser", JSON.stringify(user));

      // Success message
      console.log("Login Successful - Role:", user.role);
      if (errorMessageDiv) {
        errorMessageDiv.textContent = "Login successful! Redirecting...";
        errorMessageDiv.style.display = "block";
        errorMessageDiv.style.color = "#00d9ff";
      }

      // Redirect based on user role
      setTimeout(() => {
        redirectBasedOnRole(user);
      }, 1500);
    });
  }
});

// ============================================
// ADMIN PAGE ACCESS CONTROL
// ============================================

/**
 * Check if user has admin access and redirect if not
 */
function checkAdminAccess() {
  const currentPage = window.location.pathname.split("/").pop();

  // Pages that require admin access
  const adminPages = ["admin.html", "manage-users.html", "add-user.html"];

  if (adminPages.includes(currentPage)) {
    const user = getCurrentUser();

    if (!user) {
      // No user logged in - redirect to login
      console.log("No user logged in - redirecting to login");
      window.location.href = "login.html";
      return false;
    }

    if (user.role !== "admin") {
      // User is not admin - redirect to profile
      console.log(
        "Non-admin user attempted to access admin page - redirecting to profile",
      );
      window.location.href = "profile.html";
      return false;
    }

    console.log("Admin access granted");
    return true;
  }

  return true;
}

// Run admin access check on every page load
document.addEventListener("DOMContentLoaded", function () {
  checkAdminAccess();
});

// ============================================
// ADMIN FUNCTIONS - USER MANAGEMENT
// ============================================

/**
 * Get all users (admin only)
 * @returns {Array} Array of all users
 */
function adminGetAllUsers() {
  if (!isAdmin()) {
    console.error("Admin access required");
    return [];
  }
  return getAllUsers();
}

/**
 * Delete a user by ID or email (admin only)
 * @param {String|Number} userIdentifier - Email or ID of user to delete
 * @returns {Boolean} Success status
 */
function adminDeleteUser(userIdentifier) {
  if (!isAdmin()) {
    alert("Admin access required");
    return false;
  }

  let users = getAllUsers();
  let userIndex = -1;

  // Check if identifier is ID or email
  if (typeof userIdentifier === "number") {
    userIndex = users.findIndex((u) => u.id === userIdentifier);
  } else {
    userIndex = users.findIndex(
      (u) => u.email.toLowerCase() === userIdentifier.toLowerCase(),
    );
  }

  if (userIndex >= 0 && userIndex < users.length) {
    // Don't allow deleting the main admin account
    if (users[userIndex].email === "admin@biggyflix.com") {
      alert("Cannot delete the main admin account");
      return false;
    }

    const deletedUser = users.splice(userIndex, 1);

    // Reassign IDs to maintain order
    users.forEach((user, index) => {
      user.id = index + 1;
    });

    saveUsers(users);
    console.log("User deleted:", deletedUser[0].email);
    return true;
  }

  return false;
}

/**
 * Add a new user (admin only)
 * @param {Object} userData - User data object
 * @returns {Boolean} Success status
 */
function adminAddUser(userData) {
  if (!isAdmin()) {
    alert("Admin access required");
    return false;
  }

  // Validate required fields
  if (
    !userData.fullname ||
    !userData.email ||
    !userData.password ||
    !userData.role
  ) {
    alert("All fields are required");
    return false;
  }

  // Check if email already exists
  if (emailExists(userData.email)) {
    alert("Email already exists");
    return false;
  }

  // Validate email format
  if (!isValidEmail(userData.email)) {
    alert("Invalid email format");
    return false;
  }

  // Validate password length
  if (!isValidPassword(userData.password)) {
    alert("Password must be at least 8 characters");
    return false;
  }

  // Get all users to determine next ID
  const users = getAllUsers();

  // Find the maximum ID
  let maxId = 0;
  users.forEach((user) => {
    if (user.id && user.id > maxId) {
      maxId = user.id;
    }
  });
  const nextId = maxId + 1;

  // Create new user object
  const newUser = {
    id: nextId,
    fullname: userData.fullname,
    email: userData.email,
    password: userData.password,
    role: userData.role,
    plan: userData.plan || "basic",
    status: "active",
    createdAt: new Date().toISOString(),
  };

  // Save to localStorage
  users.push(newUser);
  saveUsers(users);

  console.log("New user added by admin:", newUser.email);

  // Dispatch a custom event so other pages can react
  window.dispatchEvent(
    new CustomEvent("usersUpdated", { detail: { users: users } }),
  );

  return true;
}

/**
 * Update user role (admin only)
 * @param {Number} userId - User ID
 * @param {String} newRole - New role (admin/moderator/user)
 * @returns {Boolean} Success status
 */
function adminUpdateUserRole(userId, newRole) {
  if (!isAdmin()) {
    alert("Admin access required");
    return false;
  }

  const users = getAllUsers();
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex >= 0) {
    // Don't allow changing the main admin's role
    if (
      users[userIndex].email === "admin@biggyflix.com" &&
      newRole !== "admin"
    ) {
      alert("Cannot change main admin role");
      return false;
    }

    users[userIndex].role = newRole;
    saveUsers(users);
    console.log("User role updated:", users[userIndex].email, "->", newRole);
    return true;
  }

  return false;
}

/**
 * Update user status (admin only)
 * @param {Number} userId - User ID
 * @param {String} newStatus - New status (active/suspended)
 * @returns {Boolean} Success status
 */
function adminUpdateUserStatus(userId, newStatus) {
  if (!isAdmin()) {
    alert("Admin access required");
    return false;
  }

  const users = getAllUsers();
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex >= 0) {
    // Don't allow suspending the main admin
    if (
      users[userIndex].email === "admin@biggyflix.com" &&
      newStatus === "suspended"
    ) {
      alert("Cannot suspend main admin account");
      return false;
    }

    users[userIndex].status = newStatus;
    saveUsers(users);
    console.log(
      "User status updated:",
      users[userIndex].email,
      "->",
      newStatus,
    );
    return true;
  }

  return false;
}

/**
 * Get user statistics (admin only)
 * @returns {Object} User statistics
 */
function adminGetUserStats() {
  if (!isAdmin()) {
    return {};
  }

  const users = getAllUsers();

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    moderators: users.filter((u) => u.role === "moderator").length,
    users: users.filter((u) => u.role === "user").length,
    active: users.filter((u) => u.status === "active").length,
    suspended: users.filter((u) => u.status === "suspended").length,
    premium: users.filter((u) => u.plan === "premium").length,
    standard: users.filter((u) => u.plan === "standard").length,
    basic: users.filter((u) => u.plan === "basic").length,
  };

  return stats;
}

// ============================================
// LOAD USERS INTO MANAGE-USERS PAGE
// ============================================

/**
 * Load users into the manage-users table
 */
function loadUsersTable() {
  const tableBody = document.getElementById("users-table-body");

  if (!tableBody) return; // Not on manage-users page

  const users = getAllUsers();

  // Clear existing rows
  tableBody.innerHTML = "";

  // Add each user to the table
  users.forEach((user) => {
    const row = document.createElement("tr");
    row.setAttribute("data-id", user.id);

    // Determine role badge class
    let roleClass = "user";
    if (user.role === "admin") roleClass = "admin";
    else if (user.role === "moderator") roleClass = "moderator";

    // Status color
    const statusColor = user.status === "active" ? "#00ff00" : "#ffaa00";
    const statusText = user.status === "active" ? "Active" : "Suspended";

    // Format date
    const createdDate = user.createdAt
      ? new Date(user.createdAt).toLocaleDateString()
      : "N/A";

    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.fullname}</td>
      <td>${user.email}</td>
      <td><span class="role-badge ${roleClass}">${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span></td>
      <td><span style="color: ${statusColor};">${statusText}</span></td>
      <td>
        <span class="plan-badge" style="color: var(--neon-cyan);">${user.plan || "basic"}</span>
      </td>
      <td>${createdDate}</td>
      <td class="action-icons">
        <button class="edit-btn" onclick="editUser(${user.id})"><i class="fas fa-edit"></i> Edit</button>
        ${
          user.email !== "admin@biggyflix.com"
            ? `<button class="delete-btn" onclick="deleteUser(${user.id})"><i class="fas fa-trash"></i> Delete</button>`
            : `<button class="edit-btn" disabled style="opacity: 0.5;" title="Cannot delete main admin"><i class="fas fa-shield"></i> Protected</button>`
        }
      </td>
    `;

    tableBody.appendChild(row);
  });

  // Update user count if element exists
  const userCountEl = document.getElementById("user-count");
  if (userCountEl) {
    userCountEl.textContent = users.length;
  }

  console.log("Users table loaded with", users.length, "users");
}

// ============================================
// PROFILE PAGE FUNCTIONS
// ============================================

/**
 * Load user data into profile page
 */
function loadProfileData() {
  const user = getCurrentUser();

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Update profile elements if they exist
  const nameElements = document.querySelectorAll(
    '.profile-name, .sidebar-name, .profile-right h2, [data-user="name"]',
  );
  nameElements.forEach((el) => {
    if (el) el.textContent = user.fullname || "User";
  });

  const emailElements = document.querySelectorAll(
    '.profile-email, .sidebar-email, [data-user="email"]',
  );
  emailElements.forEach((el) => {
    if (el) el.textContent = user.email || "";
  });

  const roleElements = document.querySelectorAll('[data-user="role"]');
  roleElements.forEach((el) => {
    if (el) el.textContent = user.role || "user";
  });

  const planElements = document.querySelectorAll('[data-user="plan"]');
  planElements.forEach((el) => {
    if (el) el.textContent = user.plan || "basic";
  });

  const sinceElements = document.querySelectorAll('[data-user="since"]');
  sinceElements.forEach((el) => {
    if (el && user.createdAt) {
      const date = new Date(user.createdAt);
      el.textContent = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    }
  });
}

// Run profile data load on profile pages
if (window.location.pathname.includes("profile.html")) {
  document.addEventListener("DOMContentLoaded", loadProfileData);
}

// ============================================
// MANAGE USERS PAGE INITIALIZATION
// ============================================

// Load users table when on manage-users page
if (window.location.pathname.includes("manage-users.html")) {
  document.addEventListener("DOMContentLoaded", function () {
    loadUsersTable();

    // Update stats if stats elements exist
    if (isAdmin()) {
      const stats = adminGetUserStats();

      const statsElements = {
        "total-users": stats.total,
        "active-users": stats.active,
        "suspended-users": stats.suspended,
        "admin-count": stats.admins,
        "moderator-count": stats.moderators,
        "user-count-role": stats.users,
        "premium-count": stats.premium,
        "standard-count": stats.standard,
        "basic-count": stats.basic,
      };

      for (const [id, value] of Object.entries(statsElements)) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
      }
    }
  });
}

// ============================================
// EDIT AND DELETE FUNCTIONS (for manage-users.html)
// ============================================

/**
 * Delete a user (called from manage-users.html)
 * @param {Number} userId - User ID to delete
 */
function deleteUser(userId) {
  if (!isAdmin()) {
    alert("Admin access required");
    return;
  }

  if (confirm(`Are you sure you want to delete user ID: ${userId}?`)) {
    if (adminDeleteUser(userId)) {
      // Show success message
      const successMsg = document.getElementById("success-message");
      if (successMsg) {
        document.getElementById("success-text").textContent =
          `User deleted successfully!`;
        successMsg.style.display = "flex";

        // Hide message after 3 seconds
        setTimeout(() => {
          successMsg.style.display = "none";
        }, 3000);
      }

      // Reload the table
      loadUsersTable();
    }
  }
}

/**
 * Edit a user (called from manage-users.html)
 * @param {Number} userId - User ID to edit
 */
function editUser(userId) {
  if (!isAdmin()) {
    alert("Admin access required");
    return;
  }

  const users = getAllUsers();
  const user = users.find((u) => u.id === userId);

  if (user) {
    // In a real application, you would redirect to an edit page or open a modal
    // For demo, we'll show an alert with options
    const action = prompt(
      `Edit User: ${user.fullname}\n\n` +
        `1. Change Role (current: ${user.role})\n` +
        `2. Change Plan (current: ${user.plan})\n` +
        `3. Change Status (current: ${user.status})\n` +
        `4. Cancel\n\n` +
        `Enter number (1-4):`,
    );

    if (action === "1") {
      const newRole = prompt(
        `Enter new role (admin/moderator/user):`,
        user.role,
      );
      if (newRole && ["admin", "moderator", "user"].includes(newRole)) {
        if (adminUpdateUserRole(userId, newRole)) {
          alert("Role updated successfully!");
          loadUsersTable();
        }
      }
    } else if (action === "2") {
      const newPlan = prompt(
        `Enter new plan (basic/standard/premium):`,
        user.plan,
      );
      if (newPlan && ["basic", "standard", "premium"].includes(newPlan)) {
        user.plan = newPlan;
        saveUsers(users);
        alert("Plan updated successfully!");
        loadUsersTable();
      }
    } else if (action === "3") {
      const newStatus = prompt(
        `Enter new status (active/suspended):`,
        user.status,
      );
      if (newStatus && ["active", "suspended"].includes(newStatus)) {
        if (adminUpdateUserStatus(userId, newStatus)) {
          alert("Status updated successfully!");
          loadUsersTable();
        }
      }
    }
  }
}

// ============================================
// LOGOUT FUNCTION
// ============================================

/**
 * Log out current user
 */
function logout() {
  sessionStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

// Add logout handler to logout links
document.addEventListener("DOMContentLoaded", function () {
  const logoutLinks = document.querySelectorAll(
    'a[href="logout.html"], a[onclick="logout()"], .logout-link',
  );
  logoutLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  });
});

// ============================================
// OPTIONAL: Real-time Email Validation
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  const emailInputs = document.querySelectorAll('input[type="email"]');

  emailInputs.forEach((emailInput) => {
    emailInput.addEventListener("blur", function () {
      if (this.value && !isValidEmail(this.value)) {
        console.warn("Invalid email format");
        this.style.borderColor = "#ff006e"; // Pink error color
      } else {
        this.style.borderColor = ""; // Reset border
      }
    });
  });
});

// ============================================
// CONSOLE LOGGING FOR DEBUGGING
// ============================================

console.log("BIGGY FLIX Authentication System Loaded");
console.log("Registered Users:", getAllUsers());
console.log("Current User:", getCurrentUser());

// ============================================
// EXPOSE FUNCTIONS GLOBALLY
// ============================================

// Make admin functions globally available to all pages
window.getAllUsers = getAllUsers;
window.isAdmin = isAdmin;
window.adminAddUser = adminAddUser;
window.adminDeleteUser = adminDeleteUser;
window.adminUpdateUserRole = adminUpdateUserRole;
window.adminUpdateUserStatus = adminUpdateUserStatus;
window.adminGetUserStats = adminGetUserStats;
window.getCurrentUser = getCurrentUser;
window.logout = logout;
window.emailExists = emailExists;
window.isValidEmail = isValidEmail;
window.isValidPassword = isValidPassword;

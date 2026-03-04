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

      // Create new user object
      const newUser = {
        fullname: fullname,
        email: email,
        password: password,
      };

      // Get existing users and add new user
      const users = getAllUsers();
      users.push(newUser);

      // Save to localStorage
      saveUsers(users);

      // Success message
      console.log("Registration Successful");
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

      // ---- LOGIN SUCCESS ----

      // Store logged-in user in sessionStorage
      sessionStorage.setItem("loggedInUser", JSON.stringify(user));

      // Success message
      console.log("Login Successful");
      if (errorMessageDiv) {
        errorMessageDiv.textContent = "Login successful! Redirecting...";
        errorMessageDiv.style.display = "block";
        errorMessageDiv.style.color = "#00d9ff";
      }

      // Redirect to profile page
      setTimeout(() => {
        window.location.href = "profile.html";
      }, 1500);
    });
  }
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

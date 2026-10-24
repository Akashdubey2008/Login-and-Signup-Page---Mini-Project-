// Theme Management
const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
    document.body.classList.toggle("dark-mode", theme === "dark");

    if (themeToggle) {
        themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
    }
}

applyTheme(localStorage.getItem("theme") || "light");

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const theme = document.body.classList.contains("dark-mode")
            ? "light" : "dark";

        localStorage.setItem("theme", theme);
        applyTheme(theme);
    });
}

// Show / Hide Password
document.querySelectorAll(".show-password").forEach(button => {
    button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.target);

        if (!input) return;

        input.type = input.type === "password" ? "text" : "password";
        button.textContent = input.type === "password" ? "Show" : "Hide";
    });
});

// Message Helper
function showMessage(element, text, type) {
    if (!element) return;

    element.textContent = text;
    element.className = "message " + type;
}

// Read Registered Users
function getUsers() {
    try {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        return Array.isArray(users) ? users : [];
    } catch {
        return [];
    }
}

// Signup
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", event => {
        event.preventDefault();

        const firstName = document.getElementById("firstName").value.trim();
        const middleName = document.getElementById("middleName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const dob = document.getElementById("dob").value;
        const mobile = document.getElementById("mobile").value.trim();
        const email = document.getElementById("signupEmail").value.trim().toLowerCase();
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const message = document.getElementById("signupMessage");

        const error = text => showMessage(message, text, "error");

        if (!firstName || !lastName) {
            return error("Enter your first and last name.");
        }

        if (!dob || dob >= new Date().toISOString().slice(0, 10)) {
            return error("Enter a valid date of birth.");
        }

        if (!/^[0-9]{10}$/.test(mobile)) {
            return error("Enter a valid 10-digit mobile number.");
        }

        if (password.length < 8) {
            return error("Password must have at least 8 characters.");
        }

        if (password !== confirmPassword) {
            return error("Passwords do not match.");
        }

        const users = getUsers();

        if (users.some(user => user.email === email)) {
            return error("Email is already registered.");
        }

        if (users.some(user => user.mobile === mobile)) {
            return error("Mobile number is already registered.");
        }

        // Demo only: never store plaintext passwords in a real application.
        users.push({
            firstName, middleName, lastName,
            dob, mobile, email, password
        });

        try {
            localStorage.setItem("users", JSON.stringify(users));
        } catch {
            return error("Unable to save account in this browser.");
        }

        showMessage(message, "Account created successfully!", "success");
        signupForm.reset();

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    });
}

// Login
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", event => {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;
        const message = document.getElementById("loginMessage");

        const user = getUsers().find(
            item => item.email === email && item.password === password
        );

        if (!user) {
            return showMessage(message, "Invalid email or password.", "error");
        }

        const name = [
            user.firstName, user.middleName, user.lastName
        ].filter(Boolean).join(" ");

        sessionStorage.setItem("loggedInUser", JSON.stringify({
            name,
            email: user.email,
            mobile: user.mobile
        }));

        window.location.href = "home.html";
    });
}

// Dashboard Access
if (window.location.pathname.endsWith("/home.html") ||
    window.location.pathname.endsWith("home.html")) {

    let user = null;

    try {
        user = JSON.parse(sessionStorage.getItem("loggedInUser"));
    } catch {
        user = null;
    }

    if (!user || !user.email) {
        window.location.replace("index.html");
    } else {
        document.getElementById("userName").textContent =
            user.name.split(" ")[0];

        document.getElementById("profileName").textContent = user.name;
        document.getElementById("userEmail").textContent = user.email;
        document.getElementById("userMobile").textContent =
            user.mobile || "Not available";
    }
}

// Logout
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        sessionStorage.removeItem("loggedInUser");
        window.location.href = "index.html";
    });
}

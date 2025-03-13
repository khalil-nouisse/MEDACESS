const BASE_URL = "http://localhost:3000";

const container = document.querySelector('.container');
    const registerBtn = document.querySelector('.register-btn');
    const loginBtn = document.querySelector('.login-btn');
    registerBtn.addEventListener('click', () => {
        container.classList.add('active');
    });
    loginBtn.addEventListener('click', () => {
        container.classList.remove('active');
    });

    const isDoctorCheckbox = document.getElementById("isDoctor");
    const dotiGroup = document.getElementById("dotiGroup");

    isDoctorCheckbox.addEventListener("change", function () {
        dotiGroup.style.display = this.checked ? "block" : "none";
    });

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginForm").addEventListener("submit", async function (e) {
        e.preventDefault();
        let isValid = true;
        let form = e.target;

        document.querySelectorAll(".error-message").forEach(el => el.remove());

        let username = form["username"].value.trim();
        let password = form["password"].value.trim();

        if (username === "") {
            showError(form["username"], "Email or your CIN is required.");
            isValid = false;
        }
        if (password === "") {
            showError(form["password"], "Password required");
            isValid = false;
        }
        login(username, password);
    });

    document.getElementById("authForm").addEventListener("submit", async function (e) {
        e.preventDefault();
        let isValid = true;
        let form = e.target;

        document.querySelectorAll(".error-message").forEach(el => el.remove());

        let f_name = form["firstName"].value.trim();
        let l_name = form["lastName"].value.trim();
        let cin = form["cin"].value.trim();
        let email = form["email"].value.trim();
        let password = form["password"].value.trim();
        let phone = form["tel"].value.trim();
        let doti = form["doti"].value.trim();
        let isDoctor = form["isDoctor"].checked; // Corrected checkbox value

        if (isDoctor && !doti) {
            showError(form["doti"], "Doti is required.");
            isValid = false;
        }

        let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (f_name === "") {
            showError(form["firstName"], "First name is required.");
            isValid = false;
        }
        if (l_name === "") {
            showError(form["lastName"], "Last name is required.");
            isValid = false;
        }
        if (cin === "") {
            showError(form["cin"], "CIN is required.");
            isValid = false;
        }
        if (email === "") {
            showError(form["email"], "Email is required.");
            isValid = false;
        } else if (!emailPattern.test(email)) {
            showError(form["email"], "Enter a valid email address.");
            isValid = false;
        } else {
            try {
                let response = await checkUsername(email);
                if (response.success) {
                    showError(form["email"], "Email already exists!");
                    isValid = false;
                }
            } catch (error) {
                console.error("Error in checkEmail:", error);
            }
        }

        if (phone === "") {
            showError(form["tel"], "Phone number is required.");
            isValid = false;
        }

        if (!isValid) {
            showToast('Review validation issues.', 'error');
            return;
        }

        signup(f_name, l_name, cin, email, phone, password, doti);
    });

    function showError(inputElement, message) {
        let error = document.createElement("div");
        error.className = "error-message";
        error.style.color = "red";
        error.style.fontSize = "12px";
        error.textContent = message;
        inputElement.insertAdjacentElement("afterend", error);
    }

    async function checkUsername(email) {
        try {
            const response = await fetch(`${BASE_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
            return await response.json();
        } catch (error) {
            console.error("Error in checkUsername:", error);
            showToast(`Error: ${error}`, "error");
        }
    }

    async function signup(f_name, l_name, cin, email, phone, password, doti) {
        try {
            const response = await fetch(`${BASE_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    first_name: f_name,   // Correspond au backend
                    last_name: l_name,    // Correspond au backend
                    CIN: cin,             // OK (case insensitive)
                    email: email,         // OK
                    tel: phone,           // Doit être "tel" et non "phone"
                    password: password,   // OK
                    doti: doti || null    // Ajoute null si pas de doti pour éviter "undefined"
                }),
            });
    
            const data = await response.json();
    
            if (data.success) {
                showToast('You have registered successfully', 'success');
                document.getElementById("authForm").reset();
            } else {
                showToast(data.message || "Oops! Something went wrong :(", 'error');
            }
        } catch (error) {
            console.error("Error:", error);
            showToast('Error connecting to the server', 'error');
        }
    }

    async function login(username, password) {
        try {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    emailorcin: username,
                    password: password
                }),
            });
    
            const data = await response.json();
    
            if (data.success) {
                showToast('Welcome back!', 'success');
                setTimeout(() => {
                    window.location.href = "./dash";
                }, 2000);
            } else {
                showToast(data.message || "Oops! Something went wrong :(", 'error');
            }
        } catch (error) {
            console.error("Error:", error);
            showToast('Error connecting to the server', 'error');
        }
    }
    

    function showToast(message, type = 'success') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => toast.remove(), 600);
        }, 5000);
    }

    window.alert = function (message) {
        showToast(message);
    };
});

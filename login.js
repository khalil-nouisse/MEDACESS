const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');
registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});
loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});


        // DOTI input visibility
 const isDoctorCheckbox = document.getElementById("isDoctor");
 const dotiGroup = document.getElementById("dotiGroup");

        isDoctorCheckbox.addEventListener("change", function() {
            if (this.checked) {
                dotiGroup.style.display = "block"; // Show DOTI input
            } else {
                dotiGroup.style.display = "none"; // Hide DOTI input
            }
        });

        // Form submission handling
        document.querySelector(".register form").addEventListener("submit", function(event) {
            event.preventDefault();

            const isDoctor = isDoctorCheckbox.checked;
            const doti = document.getElementById("doti").value;

            // Validate DOTI if the user is a doctor
            if (isDoctor && !doti) {
                alert("Please enter your DOTI.");
                return;
            }

            // Validate passwords
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            // If everything is valid, proceed with registration
            alert("Registration successful!");
            console.log("First Name:", document.getElementById("firstName").value);
            console.log("Last Name:", document.getElementById("lastName").value);
            console.log("CIN:", document.getElementById("cin").value);
            console.log("Phone:", document.getElementById("phone").value);
            console.log("Email:", document.getElementById("email").value);
            console.log("Address:", document.querySelector("input[name='address']").value);
            console.log("Is Doctor:", isDoctor);
            if (isDoctor) {
                console.log("DOTI:", doti);
            }
        })
const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();


    // =========================
    // VALIDATION
    // =========================

    if (!name || !email || !password || !confirmPassword) {

        registerMessage.textContent =
            "Please fill in all fields.";

        registerMessage.style.color = "red";

        return;
    }


    // =========================
    // PASSWORD CHECK
    // =========================

    if (password !== confirmPassword) {

        registerMessage.textContent =
            "Passwords do not match.";

        registerMessage.style.color = "red";

        return;
    }


    try {

        // =========================
        // SEND DATA TO BACKEND
        // =========================

        const response = await fetch(
            "https://digital-library-production-0221.up.railway.app/api/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    name: name,
                    email: email,
                    password: password

                })
            }
        );


        const data = await response.json();


        // =========================
        // ERROR
        // =========================

        if (!response.ok) {

            registerMessage.textContent =
                data.error || "Registration failed.";

            registerMessage.style.color = "red";

            return;
        }


        // =========================
        // SUCCESS
        // =========================

        registerMessage.textContent =
            "Account created successfully!";

        registerMessage.style.color = "green";


        // =========================
        // GO TO login
        // =========================

        setTimeout(function () {

            window.location.href = "login.html";

        }, 1000);

    }


    catch (error) {

        console.error(
            "Registration Error:",
            error
        );

        registerMessage.textContent =
            "Cannot connect to server. Please start the backend.";

        registerMessage.style.color = "red";

    }

});
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value.trim();


    // =========================
    // VALIDATION
    // =========================

    if (!email || !password) {

        loginMessage.textContent =
            "Please enter email and password.";

        loginMessage.style.color = "red";

        return;
    }


    try {

        // =========================
        // login API
        // =========================

        const response = await fetch(
            "https://digital-library-production-0221.up.railway.app/api/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );


        const data = await response.json();


        // =========================
        // login FAILED
        // =========================

        if (!response.ok) {

            loginMessage.textContent =
                data.error ||
                "Invalid email or password.";

            loginMessage.style.color = "red";

            return;
        }


        // =========================
        // USER DETAILS
        // =========================

        const user = data.user;


        // =========================
        // SAVE login DETAILS
        // =========================

        localStorage.setItem(
            "currentUser",
            user.email
        );

        localStorage.setItem(
            "currentUserId",
            user.id
        );

        localStorage.setItem(
            "currentUserName",
            user.name
        );

        localStorage.setItem(
            "currentUserRole",
            user.role
        );


        // =========================
        // LOCAL FAVORITES
        // =========================

        const userKey =
            user.email
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "_");


        if (
            !localStorage.getItem(
                `user_${userKey}_favorites`
            )
        ) {

            localStorage.setItem(
                `user_${userKey}_favorites`,
                JSON.stringify([])
            );

        }


        // =========================
        // login SUCCESS
        // =========================

        loginMessage.textContent =
            "login successful! Redirecting...";

        loginMessage.style.color = "green";


        // =========================
        // ROLE BASED REDIRECT
        // =========================

        setTimeout(function () {

            if (user.role === "admin") {

                // ADMIN
                localStorage.setItem(
                    "adminLoggedIn",
                    "true"
                );

                window.location.href =
                    "admin.html";

            } else {

                // NORMAL USER
                localStorage.removeItem(
                    "adminLoggedIn"
                );

                window.location.href =
                    "dashboard.html";
            }

        }, 800);

    }


    catch (error) {

        console.error(
            "login error:",
            error
        );

        loginMessage.textContent =
            "Cannot connect to server. Please start the backend.";

        loginMessage.style.color = "red";

    }

});
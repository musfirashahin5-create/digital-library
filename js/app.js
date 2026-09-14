// =========================
// THEME TOGGLE
// =========================

const themeBtn = document.getElementById("themeBtn");

if (themeBtn) {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");
        themeBtn.textContent = "☀️";

    } else {

        document.body.classList.remove("dark-mode");
        themeBtn.textContent = "🌙";

    }


    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("dark-mode");

        const isDark =
            document.body.classList.contains("dark-mode");

        localStorage.setItem(
            "theme",
            isDark ? "dark" : "light"
        );

        themeBtn.textContent =
            isDark ? "☀️" : "🌙";

    });

}


// =========================
// ADMIN THEME TOGGLE
// =========================

const adminThemeBtn =
    document.getElementById("adminThemeBtn");

if (adminThemeBtn) {

    const savedTheme =
        localStorage.getItem("theme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

        adminThemeBtn.textContent = "☀️";

    } else {

        document.body.classList.remove("dark-mode");

        adminThemeBtn.textContent = "🌙";

    }


    adminThemeBtn.addEventListener("click", function () {

        document.body.classList.toggle("dark-mode");

        const isDark =
            document.body.classList.contains("dark-mode");

        localStorage.setItem(
            "theme",
            isDark ? "dark" : "light"
        );

        adminThemeBtn.textContent =
            isDark ? "☀️" : "🌙";

    });

}


// =========================
// MOBILE MENU
// =========================

const menuBtn =
    document.getElementById("menuBtn");

const navLinks =
    document.getElementById("navLinks");

if (menuBtn && navLinks) {

    menuBtn.addEventListener("click", () => {

        navLinks.classList.toggle("active");

        if (
            navLinks.classList.contains("active")
        ) {

            menuBtn.textContent = "✕";

        } else {

            menuBtn.textContent = "☰";

        }

    });

}


// =========================
// LOGOUT
// =========================

function logoutUser() {

    localStorage.removeItem("currentUser");

    window.location.href =
        "login.html";

}

// =========================
// ADMIN MOBILE MENU
// =========================

const adminMenuBtn =
    document.getElementById("adminMenuBtn");

const adminNav =
    document.getElementById("adminNav");


if (adminMenuBtn && adminNav) {

    adminMenuBtn.addEventListener(
        "click",
        function () {

            adminNav.classList.toggle("active");

            if (
                adminNav.classList.contains("active")
            ) {

                adminMenuBtn.textContent = "✕";

            } else {

                adminMenuBtn.textContent = "☰";

            }

        }
    );

}
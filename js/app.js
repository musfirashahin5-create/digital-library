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
// USER MOBILE MENU
// =========================


// =========================
// USER MOBILE MENU
// =========================

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {

    // Always start with menu CLOSED
    navLinks.classList.remove("active");
    menuBtn.textContent = "☰";


    // OPEN / CLOSE MENU
    menuBtn.addEventListener("click", function (e) {

        e.stopPropagation();

        const isOpen = navLinks.classList.toggle("active");

        menuBtn.textContent = isOpen ? "✕" : "☰";

    });


    // CLOSE MENU WHEN LINK IS CLICKED
    navLinks.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", function () {

            navLinks.classList.remove("active");
            menuBtn.textContent = "☰";

        });

    });


    // CLOSE MENU WHEN CLICKING OUTSIDE
    document.addEventListener("click", function (e) {

        if (
            navLinks.classList.contains("active") &&
            !navLinks.contains(e.target) &&
            !menuBtn.contains(e.target)
        ) {

            navLinks.classList.remove("active");
            menuBtn.textContent = "☰";

        }

    });


    // RESET WHEN SWITCHING TO DESKTOP
    window.addEventListener("resize", function () {

        if (window.innerWidth > 768) {

            navLinks.classList.remove("active");
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

    // Open / Close admin menu
    adminMenuBtn.addEventListener(
        "click",
        function (e) {

            e.stopPropagation();

            adminNav.classList.toggle("active");

            if (adminNav.classList.contains("active")) {

                adminMenuBtn.textContent = "✕";

            } else {

                adminMenuBtn.textContent = "☰";

            }

        }
    );


    // Close admin menu when link is clicked
    adminNav.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", function () {

            adminNav.classList.remove("active");

            adminMenuBtn.textContent = "☰";

        });

    });


    // Close admin menu outside click
    document.addEventListener("click", function (e) {

        if (
            adminNav.classList.contains("active") &&
            !adminNav.contains(e.target) &&
            !adminMenuBtn.contains(e.target)
        ) {

            adminNav.classList.remove("active");

            adminMenuBtn.textContent = "☰";

        }

    });


    // Reset admin menu on desktop
    window.addEventListener("resize", function () {

        if (window.innerWidth > 768) {

            adminNav.classList.remove("active");

            adminMenuBtn.textContent = "☰";

        }

    });

}
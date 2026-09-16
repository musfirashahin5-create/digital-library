// =========================
// DASHBOARD ELEMENTS
// =========================

const totalBooks =
    document.getElementById("totalBooks");

const totalFavorites =
    document.getElementById("totalFavorites");

const readBooksElement =
    document.getElementById("readBooks");

const userName =
    document.getElementById("userName");


// =========================
// CURRENT USER
// =========================

const email =
    localStorage.getItem("currentUser");


// =========================
// login CHECK
// =========================

if (!email) {

    window.location.href =
        "login.html";

} else {

    const displayName =
        email.split("@")[0];

    if (userName) {

        userName.textContent =
            displayName;

    }

    loadDashboard();

}


// =========================
// LOAD DASHBOARD
// =========================

async function loadDashboard() {

    try {

        // =========================
        // GET ALL BOOKS
        // =========================

        const booksResponse =
            await fetch(
                "https://digital-library-production-0221.up.railway.app/api/books"
            );


        if (!booksResponse.ok) {

            throw new Error(
                "Failed to load books"
            );

        }


        const books =
            await booksResponse.json();


        console.log(
            "📚 Total Books:",
            books.length
        );


        // =========================
        // TOTAL BOOKS
        // =========================

        if (totalBooks) {

            totalBooks.textContent =
                books.length;

        }


        // =========================
        // GET CURRENT USER
        // =========================

        const userResponse =
            await fetch(
                `https://digital-library-production-0221.up.railway.app/api/users/by-email/${encodeURIComponent(email)}`
            );


        if (!userResponse.ok) {

            throw new Error(
                "User not found"
            );

        }


        const user =
            await userResponse.json();


        console.log(
            "👤 User:",
            user
        );


        // =========================
        // GET FAVORITES
        // =========================

        const favoritesResponse =
            await fetch(
                `https://digital-library-production-0221.up.railway.app/api/favorites/${user.id}`
            );


        if (!favoritesResponse.ok) {

            throw new Error(
                "Failed to load favorites"
            );

        }


        const favorites =
            await favoritesResponse.json();


        console.log(
            "❤️ Favorites:",
            favorites.length
        );


        // =========================
        // FAVORITES COUNT
        // =========================

        if (totalFavorites) {

            totalFavorites.textContent =
                favorites.length;

        }


        // =========================
        // READ BOOKS
        // =========================

        const userKey =
            email.toLowerCase()
                .replace(/[^a-z0-9]/g, "_");


        const readBooks =
            JSON.parse(
                localStorage.getItem(
                    `user_${userKey}_readBooks`
                )
            ) || [];


        console.log(
            "📖 Read Books:",
            readBooks
        );


        // =========================
        // READ BOOKS COUNT
        // =========================

        if (readBooksElement) {

            readBooksElement.textContent =
                readBooks.length;

        }


    } catch (error) {

        console.error(
            "❌ Dashboard Error:",
            error
        );


        // =========================
        // FALLBACK VALUES
        // =========================

        if (totalBooks) {

            totalBooks.textContent =
                "0";

        }


        if (totalFavorites) {

            totalFavorites.textContent =
                "0";

        }


        if (readBooksElement) {

            readBooksElement.textContent =
                "0";

        }

    }

}

function continueReading() {

    const email = localStorage.getItem("currentUser");

    if (!email) {
        alert("Please login first 🔐");
        window.location.href = "login.html";
        return;
    }

    const userKey = email.toLowerCase().replace(/[^a-z0-9]/g, "_");

    const readBooks = JSON.parse(
        localStorage.getItem(`user_${userKey}_readBooks`)
    ) || [];

    if (readBooks.length === 0) {
        alert("You haven't read any books yet 📚");
        window.location.href = "books.html";
        return;
    }

    // Last read book
    const lastReadBook = readBooks[readBooks.length - 1];

    localStorage.setItem("selectedBook", lastReadBook);

    window.location.href = "reader.html";
}

function showReadBooks() {

    const email = localStorage.getItem("currentUser");

    if (!email) {
        alert("Please login first 🔐");
        window.location.href = "login.html";
        return;
    }

    const userKey = email.toLowerCase().replace(/[^a-z0-9]/g, "_");

    const readBooks = JSON.parse(
        localStorage.getItem(`user_${userKey}_readBooks`)
    ) || [];

    if (readBooks.length === 0) {
        alert("You haven't read any books yet 📚");
        return;
    }

    // Open the last read book
    const lastReadBook = readBooks[readBooks.length - 1];

    localStorage.setItem("selectedBook", lastReadBook);

    window.location.href = "reader.html";
}
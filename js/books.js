// =========================
// BOOKS ARRAY
// =========================

let books = [];


// =========================
// LOAD BOOKS FROM MYSQL
// =========================

async function loadBooks() {

    const container =
        document.getElementById("booksContainer");

    if (!container) {
        console.error("❌ booksContainer not found");
        return;
    }

    try {

        container.innerHTML = `
            <p class="loading-books">
                📚 Loading books...
            </p>
        `;

        const response = await fetch(
            "http://localhost:5000/api/books"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch books");
        }

        books = await response.json();

        console.log(
            "✅ Books loaded from MySQL:",
            books
        );


        // =========================================
        // RECENTLY ADDED BOOKS
        // =========================================

        const urlParams =
            new URLSearchParams(window.location.search);

        const sortType =
            urlParams.get("sort");

        const category =
            urlParams.get("category");


        // =========================
        // RECENTLY ADDED BOOKS
        // =========================

        if (sortType === "recent") {

            books.sort((a, b) => {
                return Number(b.id) - Number(a.id);
            });

            console.log(
                "🕐 Recently Added Books:",
                books
            );
        }


        // =========================
        // HOME CATEGORY FILTER
        // =========================

        if (category) {

            const decodedCategory =
                decodeURIComponent(category)
                    .trim()
                    .toLowerCase();


            const filteredBooks =
                books.filter(book => {

                    return String(
                        book.category || ""
                    )
                        .trim()
                        .toLowerCase()
                        === decodedCategory;

                });


            console.log(
                "📚 Selected Category:",
                category
            );

            console.log(
                "📚 Filtered Books:",
                filteredBooks
            );


            displayBooks(filteredBooks);

        } else {

            displayBooks();

        }

    } catch (error) {

        console.error(
            "❌ Error loading books:",
            error
        );

        container.innerHTML = `
            <div class="no-books">

                <h2>❌ Unable to Load Books</h2>

                <p>
                    Please make sure the backend
                    server is running.
                </p>

            </div>
        `;
    }
}


// =========================
// DISPLAY BOOKS
// =========================

function displayBooks(bookList = books) {

    const container =
        document.getElementById("booksContainer");

    if (!container) return;


    if (!bookList || bookList.length === 0) {

        container.innerHTML = `
            <div class="no-books">

                <h2>📚 No Books Found</h2>

                <p>
                    No books are available
                    in the library.
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML = bookList.map(book => {

        // =========================
        // COVER IMAGE URL
        // =========================

        let bookImage = book.cover_image;

        if (
            bookImage &&
            !bookImage.startsWith("http")
        ) {

            bookImage =
                `http://localhost:5000/${bookImage}`;
        }


        if (!bookImage) {

            bookImage =
                "https://via.placeholder.com/300x400?text=Book";
        }


        // =========================
        // RATING
        // =========================

        const rating =
            book.rating !== null &&
                book.rating !== undefined
                ? book.rating
                : "N/A";


        return `

            <div class="book-card">

                <!-- =========================
                     BOOK COVER
                ========================== -->

                <div class="book-image">

                    <img
                        src="${bookImage}"
                        alt="${book.title}"
                        onerror="
                            this.src='https://via.placeholder.com/300x400?text=Book'
                        "
                    >


                    <!-- RATING -->

                    <span class="rating-badge">
                        ⭐ ${rating}
                    </span>


                    <!-- FAVORITE -->

                    <button
                        class="card-favorite"
                        onclick="addCardFavorite(${book.id})"
                        title="Add to Favorites"
                    >
                        ❤️
                    </button>

                </div>


                <!-- =========================
                     BOOK INFO
                ========================== -->

                <div class="book-info">


                    <span class="book-category">

                        ${book.category || "General"}

                    </span>


                    <h3>
                        ${book.title}
                    </h3>


                    <p class="book-author">

                        By ${book.author || "Unknown Author"}

                    </p>


                    <div class="book-meta">

                        <span>
                            📅 ${book.year || "N/A"}
                        </span>

                        <span>
                            📄 ${book.pages || "N/A"} Pages
                        </span>

                    </div>


                    <!-- VIEW DETAILS -->

                    <button
                        class="details-btn"
                        onclick="viewBook(${book.id})"
                    >
                        📖 View Details
                    </button>


                </div>

            </div>

        `;

    }).join("");
}


// =========================
// VIEW BOOK DETAILS
// =========================

function viewBook(id) {

    localStorage.setItem(
        "selectedBook",
        id
    );

    window.location.href =
        "book-details.html";
}


// =========================
// SEARCH
// =========================

function searchBooks() {

    const searchInput =
        document.getElementById("searchInput");

    if (!searchInput) return;


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const filteredBooks =
        books.filter(book => {

            return (

                String(book.title || "")
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(book.author || "")
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(book.category || "")
                    .toLowerCase()
                    .includes(searchText)

            );

        });


    displayBooks(filteredBooks);
}


// =========================
// CATEGORY FILTER
// =========================

function filterByCategory(category) {

    if (
        !category ||
        category === "all" ||
        category === "All"
    ) {

        displayBooks();

        return;
    }


    const filteredBooks =
        books.filter(book => {

            return (
                String(book.category || "")
                    .toLowerCase() ===
                category.toLowerCase()
            );

        });


    displayBooks(filteredBooks);
}


// =========================
// ADD TO FAVORITES
// =========================

async function addCardFavorite(bookId) {

    const email =
        localStorage.getItem("currentUser");


    if (!email) {

        alert("Please login first 🔐");

        window.location.href =
            "login.html";

        return;
    }


    try {

        // GET USER

        const userResponse =
            await fetch(
                `http://localhost:5000/api/users/by-email/${encodeURIComponent(email)}`
            );


        if (!userResponse.ok) {

            throw new Error("User not found");

        }


        const user =
            await userResponse.json();


        // ADD FAVORITE

        const response =
            await fetch(
                "http://localhost:5000/api/favorites",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        user_id: user.id,

                        book_id: bookId

                    })
                }
            );


        const result =
            await response.json();


        if (response.status === 409) {

            alert(
                "❤️ This book is already in Favorites!"
            );

            return;
        }


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Failed to add favorite"
            );

        }


        alert(
            "❤️ Book added to Favorites!"
        );


        console.log(
            "✅ Favorite saved:",
            result
        );


    } catch (error) {

        console.error(
            "❌ Favorite error:",
            error
        );


        alert(
            "❌ Unable to add favorite."
        );
    }
}


// =========================
// THEME
// =========================

function setupTheme() {

    const themeBtn =
        document.getElementById("themeBtn");

    if (!themeBtn) return;


    const savedTheme =
        localStorage.getItem("theme");


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

        themeBtn.textContent = "☀️";

    }


    themeBtn.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark-mode"
            );


            const isDark =
                document.body.classList.contains(
                    "dark-mode"
                );


            localStorage.setItem(
                "theme",
                isDark ? "dark" : "light"
            );


            themeBtn.textContent =
                isDark ? "☀️" : "🌙";

        }
    );
}


// =========================
// LOGOUT
// =========================

function logoutUser() {

    localStorage.removeItem(
        "currentUser"
    );

    window.location.href =
        "login.html";
}


// =========================
// INITIALIZE
// =========================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupTheme();


        const searchInput =
            document.getElementById(
                "searchInput"
            );


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                searchBooks
            );

        }


        const categoryFilter =
            document.getElementById(
                "categoryFilter"
            );


        if (categoryFilter) {

            categoryFilter.addEventListener(
                "change",
                () => {

                    filterByCategory(
                        categoryFilter.value
                    );

                }
            );

        }


        loadBooks();

    }
);


// =========================
// MOBILE MENU
// =========================

const menuBtn =
    document.getElementById("menuBtn");

const navLinks =
    document.getElementById("navLinks");


if (menuBtn && navLinks) {

    menuBtn.addEventListener(
        "click",
        () => {

            navLinks.classList.toggle(
                "active"
            );


            if (
                navLinks.classList.contains(
                    "active"
                )
            ) {

                menuBtn.textContent = "✕";

            } else {

                menuBtn.textContent = "☰";

            }

        }
    );

}
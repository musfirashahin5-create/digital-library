// =========================
// GET SELECTED BOOK ID
// =========================

const bookId =
    localStorage.getItem("selectedBook");

console.log("📌 Selected Book ID:", bookId);

// =========================
// LOAD BOOK DETAILS
// =========================

async function loadBookDetails() {

    if (!bookId) {

        alert("No book selected!");

        window.location.href =
            "books.html";

        return;
    }


    try {

        const response =
            await fetch(
                `https://digital-library-production-0221.up.railway.app/api/books/${bookId}`
            );


        if (!response.ok) {

            throw new Error(
                "Book not found"
            );

        }


        const book =
            await response.json();


        console.log(
            "✅ Book loaded from MySQL:",
            book
        );


        displayBookDetails(book);


    } catch (error) {

        console.error(
            "❌ Error loading book:",
            error
        );


        const container =
            document.getElementById(
                "bookDetails"
            );


        if (container) {

            container.innerHTML = `

                <div class="no-books">

                    <h2>
                        ❌ Book Not Found
                    </h2>

                    <p>
                        Unable to load this book.
                    </p>

                    <button
                        onclick="window.location.href='books.html'"
                    >
                        ← Back to Books
                    </button>

                </div>

            `;

        }

    }

}


// =========================
// DISPLAY BOOK DETAILS
// =========================

function displayBookDetails(book) {

    const container =
        document.getElementById(
            "bookDetails"
        );


    if (!container) return;


    // =========================
    // COVER IMAGE URL
    // =========================

    let bookImage =
        book.cover_image;


    if (
        bookImage &&
        !bookImage.startsWith("http")
    ) {

        bookImage =
            `https://digital-library-production-0221.up.railway.app/${bookImage}`;

    }


    // =========================
    // PLACEHOLDER
    // =========================

    if (!bookImage) {

        bookImage =
            "https://via.placeholder.com/300x400?text=Book";

    }


    // =========================
    // DISPLAY DETAILS
    // =========================

    container.innerHTML = `

        <div class="details-card">


            <!-- =========================
                 BOOK COVER
            ========================= -->

            <div class="details-image">

                <img
                    src="${bookImage}"
                    alt="${book.title}"
                    onerror="
                        this.src='https://via.placeholder.com/300x400?text=Book'
                    "
                >

            </div>


            <!-- =========================
                 BOOK INFORMATION
            ========================= -->

            <div class="details-content">


                <span class="book-category">

                    ${book.category || "General"}

                </span>


                <h1>

                    ${book.title}

                </h1>


                <h3>

                    By ${book.author || "Unknown Author"}

                </h3>


                <p class="description">

                    ${book.description ||
                    "No description available."}

                </p>


                <!-- =========================
                     BOOK INFORMATION
                ========================= -->

                <div class="book-details-info">


                    <p>

                        📅
                        <strong>Published:</strong>
                        ${book.year || "N/A"}

                    </p>


                    <p>

                        📄
                        <strong>Pages:</strong>
                        ${book.pages || "N/A"}

                    </p>


                    <p>

                        ⭐
                        <strong>Rating:</strong>
                        ${book.rating || "N/A"}

                    </p>


                    <p class="available">

                        🟢 Available to Read

                    </p>


                </div>


                <!-- =========================
                     BUTTONS
                ========================= -->

                <div class="details-buttons">


                    <button
                        class="favorite-btn"
                        onclick="addFavorite(${book.id})"
                    >

                        ❤️ Add to Favorites

                    </button>


                    <button
                        class="read-btn"
                        onclick="readBook(${book.id})"
                    >

                        📖 Read Book

                    </button>


                </div>


            </div>

        </div>

    `;

}


// =========================
// ADD FAVORITE
// =========================

async function addFavorite(bookId) {

    const email =
        localStorage.getItem(
            "currentUser"
        );


    // =========================
    // CHECK login
    // =========================

    if (!email) {

        alert(
            "Please login first 🔐"
        );

        window.location.href =
            "login.html";

        return;

    }


    try {

        // =========================
        // GET USER
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
            "✅ User found:",
            user
        );


        // =========================
        // SAVE FAVORITE
        // =========================

        const response =
            await fetch(
                "https://digital-library-production-0221.up.railway.app/api/favorites",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        user_id:
                            user.id,

                        book_id:
                            bookId

                    })

                }
            );


        const result =
            await response.json();


        // =========================
        // ALREADY FAVORITE
        // =========================

        if (
            response.status === 409
        ) {

            alert(
                "Book is already in Favorites! ❤️"
            );

            return;

        }


        // =========================
        // ERROR
        // =========================

        if (!response.ok) {

            throw new Error(
                result.error ||
                "Failed to add favorite"
            );

        }


        // =========================
        // SUCCESS
        // =========================

        alert(
            "Book added to Favorites ❤️"
        );


        console.log(
            "✅ Favorite saved in MySQL:",
            result
        );


    } catch (error) {

        console.error(
            "❌ Favorite error:",
            error
        );


        alert(
            "Unable to add favorite."
        );

    }

}


// =========================
// READ BOOK
// =========================

function readBook(id) {

    const email =
        localStorage.getItem("currentUser");

    if (!email) {

        alert("Please login first 🔐");

        window.location.href =
            "login.html";

        return;
    }


    // Create unique key for each user
    const userKey =
        email.toLowerCase()
            .replace(/[^a-z0-9]/g, "_");


    // Get existing read books
    let readBooks =
        JSON.parse(
            localStorage.getItem(
                `user_${userKey}_readBooks`
            )
        ) || [];


    // Convert ID to string for consistency
    id = String(id);


    // Add only if book is not already read
    if (!readBooks.includes(id)) {

        readBooks.push(id);

        localStorage.setItem(
            `user_${userKey}_readBooks`,
            JSON.stringify(readBooks)
        );

    }


    console.log(
        "📖 Read Books:",
        readBooks
    );


    // Open Reader
    localStorage.setItem(
        "selectedBook",
        id
    );


    window.location.href =
        "reader.html";

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
// START
// =========================

loadBookDetails();
// =========================
// FAVORITE CONTAINER
// =========================

const favoriteContainer =
    document.getElementById("favoriteContainer");


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

    loadFavorites();

}


// =========================
// LOAD USER FAVORITES
// =========================

async function loadFavorites() {

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
            "✅ User:",
            user
        );


        // =========================
        // GET FAVORITES
        // =========================

        const response =
            await fetch(
                `https://digital-library-production-0221.up.railway.app/api/favorites/${user.id}`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load favorites"
            );

        }


        const favoriteBooks =
            await response.json();


        console.log(
            "❤️ Favorites:",
            favoriteBooks
        );


        displayFavorites(
            favoriteBooks
        );


    } catch (error) {

        console.error(
            "❌ Favorites error:",
            error
        );


        if (favoriteContainer) {

            favoriteContainer.innerHTML = `

                <div class="no-books">

                    <h2>
                        ❌ Unable to Load Favorites
                    </h2>

                    <p>
                        Please make sure the backend
                        server is running.
                    </p>

                </div>

            `;

        }

    }

}


// =========================
// DISPLAY FAVORITES
// =========================

function displayFavorites(
    favoriteBooks
) {

    if (!favoriteContainer) {

        console.error(
            "❌ favoriteContainer not found"
        );

        return;

    }


    // =========================
    // NO FAVORITES
    // =========================

    if (
        !favoriteBooks ||
        favoriteBooks.length === 0
    ) {

        favoriteContainer.innerHTML = `

            <div class="no-books">

                <h2>
                    No Favorite Books ❤️
                </h2>

                <p>
                    Add books to your favorites.
                </p>

            </div>

        `;

        return;

    }


    favoriteContainer.innerHTML = "";


    // =========================
    // CREATE FAVORITE CARDS
    // =========================

    favoriteBooks.forEach(book => {

        const card =
            document.createElement("div");


        card.className =
            "book-card";


        // =========================
        // COVER IMAGE
        // =========================

        let bookImage =
            book.cover_image;


        /*
            MySQL stores:

            uploads/covers/book.jpg

            Convert it to:

            https://digital-library-production-0221.up.railway.app/uploads/covers/book.jpg
        */

        if (
            bookImage &&
            !bookImage.startsWith("http")
        ) {

            bookImage =
                `https://digital-library-production-0221.up.railway.app/${bookImage}`;

        }


        // =========================
        // FALLBACK IMAGE
        // =========================

        if (!bookImage) {

            bookImage =
                "https://via.placeholder.com/300x400?text=Book";

        }


        // =========================
        // CARD
        // =========================

        card.innerHTML = `

            <!-- BOOK COVER -->

            <div class="book-image">

                <img
                    src="${bookImage}"
                    alt="${book.title}"
                    onerror="
                        this.src='https://via.placeholder.com/300x400?text=Book'
                    "
                >

            </div>


            <!-- BOOK INFORMATION -->

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

                        ⭐ ${book.rating || "N/A"}

                    </span>

                </div>


                <!-- VIEW DETAILS -->

                <button
                    class="details-btn"
                    onclick="viewFavoriteBook(${book.id})"
                >

                    📖 View Details

                </button>


                <!-- REMOVE FAVORITE -->

                <button
                    class="details-btn"
                    onclick="removeFavorite(${book.id})"
                >

                    ❌ Remove Favorite

                </button>


            </div>

        `;


        favoriteContainer.appendChild(card);

    });

}


// =========================
// VIEW BOOK DETAILS
// =========================

function viewFavoriteBook(id) {
    localStorage.setItem("selectedBook", id);
    window.location.href = "book-details.html";
}

// =========================
// REMOVE FAVORITE
// =========================

async function removeFavorite(bookId) {

    try {

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


        // =========================
        // DELETE FAVORITE
        // =========================

        const response =
            await fetch(
                `https://digital-library-production-0221.up.railway.app/api/favorites/${user.id}/${bookId}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Failed to remove favorite"
            );

        }


        alert(
            "Favorite removed ❤️"
        );


        // =========================
        // RELOAD
        // =========================

        loadFavorites();


    } catch (error) {

        console.error(
            "❌ Remove favorite error:",
            error
        );


        alert(
            "Unable to remove favorite."
        );

    }

}


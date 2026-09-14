// =====================================================
// ADMIN BOOK MANAGEMENT
// ADD + EDIT + DELETE + SEARCH
// =====================================================

const API_URL = "http://localhost:5000/api/books";


// =====================================================
// ALL BOOKS
// =====================================================

let allAdminBooks = [];


// =====================================================
// FORM ELEMENTS
// =====================================================

const addBookForm =
    document.getElementById("addBookForm");

const submitBookBtn =
    document.getElementById("submitBookBtn");

const cancelEditBtn =
    document.getElementById("cancelEditBtn");

const formTitle =
    document.getElementById("formTitle");

const coverImage =
    document.getElementById("coverImage");

const bookPdf =
    document.getElementById("bookPdf");

const coverHint =
    document.getElementById("coverHint");

const pdfHint =
    document.getElementById("pdfHint");


// =====================================================
// SEARCH ELEMENT
// =====================================================

const bookSearch =
    document.getElementById("bookSearch");


// =====================================================
// EDITING BOOK ID
// =====================================================

let editingBookId = null;


// =====================================================
// ADD / UPDATE BOOK
// =====================================================

if (addBookForm) {

    addBookForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ==========================================
            // GET FORM VALUES
            // ==========================================

            const title =
                document.getElementById("title")
                    .value.trim();


            const author =
                document.getElementById("author")
                    .value.trim();


            const category =
                document.getElementById("category")
                    .value;


            const year =
                document.getElementById("year")
                    .value;


            const pages =
                document.getElementById("pages")
                    .value;


            const rating =
                document.getElementById("rating")
                    .value;


            const description =
                document.getElementById("description")
                    .value.trim();


            const selectedCover =
                coverImage.files[0];


            const selectedPdf =
                bookPdf.files[0];


            // ==========================================
            // NEW BOOK VALIDATION
            // ==========================================

            if (!editingBookId) {

                if (!selectedCover) {

                    alert(
                        "❌ Please select a cover image."
                    );

                    return;

                }


                if (!selectedPdf) {

                    alert(
                        "❌ Please select a book PDF."
                    );

                    return;

                }

            }


            // ==========================================
            // IMAGE VALIDATION
            // ==========================================

            if (selectedCover) {

                const allowedImages = [
                    "image/jpeg",
                    "image/jpg",
                    "image/png",
                    "image/webp"
                ];


                if (
                    !allowedImages.includes(
                        selectedCover.type
                    )
                ) {

                    alert(
                        "❌ Please upload JPG, PNG or WEBP image."
                    );

                    return;

                }

            }


            // ==========================================
            // PDF VALIDATION
            // ==========================================

            if (selectedPdf) {

                if (
                    selectedPdf.type !==
                    "application/pdf"
                ) {

                    alert(
                        "❌ Please upload a valid PDF file."
                    );

                    return;

                }

            }


            // ==========================================
            // CREATE FORM DATA
            // ==========================================

            const formData =
                new FormData();


            formData.append(
                "title",
                title
            );


            formData.append(
                "author",
                author
            );


            formData.append(
                "category",
                category
            );


            formData.append(
                "year",
                year
            );


            formData.append(
                "pages",
                pages
            );


            formData.append(
                "rating",
                rating
            );


            formData.append(
                "description",
                description
            );


            if (selectedCover) {

                formData.append(
                    "coverImage",
                    selectedCover
                );

            }


            if (selectedPdf) {

                formData.append(
                    "bookPdf",
                    selectedPdf
                );

            }


            // ==========================================
            // URL + METHOD
            // ==========================================

            const url =
                editingBookId
                    ? `${API_URL}/${editingBookId}`
                    : API_URL;


            const method =
                editingBookId
                    ? "PUT"
                    : "POST";


            try {

                submitBookBtn.disabled = true;


                submitBookBtn.textContent =
                    editingBookId
                        ? "Updating..."
                        : "Adding...";


                const response =
                    await fetch(
                        url,
                        {
                            method: method,
                            body: formData
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Operation failed"
                    );

                }


                // ======================================
                // SUCCESS MESSAGE
                // ======================================

                if (editingBookId) {

                    alert(
                        "✅ Book updated successfully!"
                    );

                } else {

                    alert(
                        "✅ Book added successfully!"
                    );

                }


                // ======================================
                // RESET
                // ======================================

                resetBookForm();


                localStorage.removeItem(
                    "editBookId"
                );


                // ======================================
                // GO TO MANAGE BOOKS
                // ======================================

                window.location.href =
                    "admin-manage-books.html";


            } catch (error) {

                console.error(
                    "❌ Book Error:",
                    error
                );


                alert(
                    "❌ " + error.message
                );

            } finally {

                submitBookBtn.disabled = false;

            }

        }
    );

}


// =====================================================
// LOAD BOOKS
// =====================================================

async function loadAdminBooks() {

    const container =
        document.getElementById(
            "adminBooksContainer"
        );


    // Only runs on Manage Books page

    if (!container) return;


    try {

        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                "Failed to load books"
            );

        }


        const books =
            await response.json();


        // ==========================================
        // STORE ALL BOOKS
        // ==========================================

        allAdminBooks = books;


        // ==========================================
        // DISPLAY BOOKS
        // ==========================================

        displayAdminBooks(books);


    } catch (error) {

        console.error(
            "❌ Load Books Error:",
            error
        );


        container.innerHTML = `
            <p>
                ❌ Unable to load books.
                Please check your backend server.
            </p>
        `;

    }

}


// =====================================================
// DISPLAY BOOKS
// =====================================================

function displayAdminBooks(books) {

    const container =
        document.getElementById(
            "adminBooksContainer"
        );


    if (!container) return;


    // ================================================
    // NO BOOKS
    // ================================================

    if (
        !books ||
        books.length === 0
    ) {

        container.innerHTML = `
            <p>
                No books available.
            </p>
        `;

        return;

    }


    // ================================================
    // DISPLAY ALL BOOKS
    // ================================================

    container.innerHTML =
        books.map(book => {

            const imageUrl =
                book.cover_image
                    ? (
                        book.cover_image.startsWith("http")
                            ? book.cover_image
                            : `http://localhost:5000/${book.cover_image}`
                    )
                    : "";


            return `

                <div class="admin-book-item">

                    <div class="admin-book-info">

                        ${
                            imageUrl
                                ? `
                                    <img
                                        src="${imageUrl}"
                                        alt="${escapeHtml(book.title)}"
                                    >
                                  `
                                : `
                                    <div class="admin-no-image">
                                        📚
                                    </div>
                                  `
                        }


                        <div>

                            <h3>
                                ${escapeHtml(book.title)}
                            </h3>


                            <p>
                                By
                                ${escapeHtml(
                                    book.author || "Unknown"
                                )}
                            </p>


                            <p>
                                ${escapeHtml(
                                    book.category || "General"
                                )}
                                |
                                ${book.year || "N/A"}
                            </p>


                            <p>
                                ⭐
                                ${book.rating || "N/A"}
                            </p>

                        </div>

                    </div>


                    <div class="admin-book-actions">

                        <button
                            class="admin-edit-btn"
                            onclick="editBook(${book.id})">

                            ✏️ Edit

                        </button>


                        <button
                            class="admin-delete-btn"
                            onclick="deleteBook(${book.id})">

                            🗑️ Delete

                        </button>

                    </div>

                </div>

            `;

        }).join("");

}


// =====================================================
// SEARCH BOOKS
// =====================================================

if (bookSearch) {

    bookSearch.addEventListener(
        "input",
        function () {

            const searchValue =
                this.value
                    .toLowerCase()
                    .trim();


            // ==========================================
            // SHOW ALL BOOKS
            // ==========================================

            if (!searchValue) {

                displayAdminBooks(
                    allAdminBooks
                );

                return;

            }


            // ==========================================
            // FILTER BOOKS
            // ==========================================

            const filteredBooks =
                allAdminBooks.filter(book => {

                    const title =
                        (
                            book.title || ""
                        ).toLowerCase();


                    const author =
                        (
                            book.author || ""
                        ).toLowerCase();


                    const category =
                        (
                            book.category || ""
                        ).toLowerCase();


                    const year =
                        String(
                            book.year || ""
                        ).toLowerCase();


                    return (
                        title.includes(searchValue) ||
                        author.includes(searchValue) ||
                        category.includes(searchValue) ||
                        year.includes(searchValue)
                    );

                });


            // ==========================================
            // NO SEARCH RESULT
            // ==========================================

            if (filteredBooks.length === 0) {

                const container =
                    document.getElementById(
                        "adminBooksContainer"
                    );


                container.innerHTML = `
                    <div class="admin-no-results">

                        <p>
                            🔍 No books found for
                            "<strong>${escapeHtml(searchValue)}</strong>"
                        </p>

                    </div>
                `;

                return;

            }


            // ==========================================
            // DISPLAY FILTERED BOOKS
            // ==========================================

            displayAdminBooks(
                filteredBooks
            );

        }
    );

}


// =====================================================
// EDIT BOOK
// =====================================================

async function editBook(id) {

    try {

        // ==========================================
        // CHECK BOOK EXISTS
        // ==========================================

        const response =
            await fetch(
                `${API_URL}/${id}`
            );


        if (!response.ok) {

            throw new Error(
                "Book not found"
            );

        }


        // ==========================================
        // SAVE ID
        // ==========================================

        localStorage.setItem(
            "editBookId",
            id
        );


        // ==========================================
        // OPEN ADD BOOK PAGE
        // ==========================================

        window.location.href =
            "admin-add-book.html";


    } catch (error) {

        console.error(
            "❌ Edit Error:",
            error
        );


        alert(
            "❌ Unable to load book details."
        );

    }

}


// =====================================================
// LOAD EDIT BOOK
// =====================================================

async function loadEditBook() {

    // Only runs on Add Book page

    if (!addBookForm) return;


    const editBookId =
        localStorage.getItem(
            "editBookId"
        );


    // No edit requested

    if (!editBookId) return;


    try {

        const response =
            await fetch(
                `${API_URL}/${editBookId}`
            );


        if (!response.ok) {

            throw new Error(
                "Book not found"
            );

        }


        const book =
            await response.json();


        // ==========================================
        // SET EDIT ID
        // ==========================================

        editingBookId =
            Number(editBookId);


        // ==========================================
        // FILL FORM
        // ==========================================

        document.getElementById("title").value =
            book.title || "";


        document.getElementById("author").value =
            book.author || "";


        document.getElementById("category").value =
            book.category || "";


        document.getElementById("year").value =
            book.year || "";


        document.getElementById("pages").value =
            book.pages || "";


        document.getElementById("rating").value =
            book.rating || "";


        document.getElementById("description").value =
            book.description || "";


        // ==========================================
        // CHANGE FORM TO EDIT MODE
        // ==========================================

        if (formTitle) {

            formTitle.textContent =
                "✏️ Edit Book";

        }


        if (submitBookBtn) {

            submitBookBtn.textContent =
                "💾 Update Book";

        }


        // ==========================================
        // CANCEL BUTTON
        // ==========================================

        if (cancelEditBtn) {

            cancelEditBtn.style.display =
                "inline-block";

        }


        // ==========================================
        // FILES OPTIONAL DURING EDIT
        // ==========================================

        if (coverImage) {

            coverImage.required = false;

        }


        if (bookPdf) {

            bookPdf.required = false;

        }


        if (coverHint) {

            coverHint.textContent =
                "Optional - choose new image to replace";

        }


        if (pdfHint) {

            pdfHint.textContent =
                "Optional - choose new PDF to replace";

        }


    } catch (error) {

        console.error(
            "❌ Load Edit Error:",
            error
        );


        alert(
            "❌ Unable to load book details."
        );


        localStorage.removeItem(
            "editBookId"
        );

    }

}


// =====================================================
// DELETE BOOK
// =====================================================

async function deleteBook(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this book?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Failed to delete book"
            );

        }


        alert(
            "🗑️ Book deleted successfully!"
        );


        // ==========================================
        // RELOAD BOOK LIST
        // ==========================================

        await loadAdminBooks();


    } catch (error) {

        console.error(
            "❌ Delete Error:",
            error
        );


        alert(
            "❌ " + error.message
        );

    }

}


// =====================================================
// CANCEL EDIT
// =====================================================

if (cancelEditBtn) {

    cancelEditBtn.addEventListener(
        "click",
        function () {

            resetBookForm();


            localStorage.removeItem(
                "editBookId"
            );

        }
    );

}


// =====================================================
// RESET FORM
// =====================================================

function resetBookForm() {

    editingBookId = null;


    if (addBookForm) {

        addBookForm.reset();

    }


    if (formTitle) {

        formTitle.textContent =
            "➕ Add New Book";

    }


    if (submitBookBtn) {

        submitBookBtn.textContent =
            "➕ Add Book";

    }


    if (cancelEditBtn) {

        cancelEditBtn.style.display =
            "none";

    }


    if (coverImage) {

        coverImage.required = true;

    }


    if (bookPdf) {

        bookPdf.required = true;

    }


    if (coverHint) {

        coverHint.textContent =
            "Required for new book";

    }


    if (pdfHint) {

        pdfHint.textContent =
            "Required for new book";

    }

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value;


    return div.innerHTML;

}


// =====================================================
// START
// =====================================================

// Manage Books page
loadAdminBooks();


// Add Book page
loadEditBook();
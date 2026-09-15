// =========================
// SELECTED BOOK
// =========================

const bookId =
    localStorage.getItem("selectedBook");


// =========================
// READER VARIABLES
// =========================

let currentBook = null;


// =========================
// LOAD BOOK
// =========================

async function loadReaderBook() {

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


        currentBook =
            await response.json();


        console.log(
            "✅ Reader book loaded:",
            currentBook
        );


        // =========================
        // TITLE
        // =========================

        const title =
            document.getElementById(
                "readerTitle"
            );

        if (title) {

            title.textContent =
                currentBook.title;

        }


        // =========================
        // AUTHOR
        // =========================

        const author =
            document.getElementById(
                "readerAuthor"
            );

        if (author) {

            author.textContent =
                `By ${currentBook.author}`;

        }


        // =========================
        // OPEN PDF
        // =========================

        openBookPDF();


    } catch (error) {

        console.error(
            "❌ Reader error:",
            error
        );


        const content =
            document.getElementById(
                "readerContent"
            );


        if (content) {

            content.innerHTML = `

                <div class="reader-error">

                    <h2>
                        ❌ Unable to Load Book
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
// OPEN BOOK PDF
// =========================

function openBookPDF() {

    const content =
        document.getElementById(
            "readerContent"
        );


    if (!content) {

        console.error(
            "❌ readerContent not found"
        );

        return;

    }


    // =========================
    // CHECK PDF
    // =========================

    if (!currentBook.pdf_file) {

        content.innerHTML = `

            <div class="reader-error">

                <h2>
                    📄 PDF Not Available
                </h2>

                <p>
                    This book does not have a PDF
                    uploaded yet.
                </p>

            </div>

        `;

        return;

    }


    // =========================
    // CREATE PDF URL
    // =========================

    let pdfUrl =
        currentBook.pdf_file;


    if (
        !pdfUrl.startsWith("http")
    ) {

        pdfUrl =
            `https://digital-library-production-0221.up.railway.app/${pdfUrl}`;

    }


    console.log(
        "📄 PDF URL:",
        pdfUrl
    );


    // =========================
    // DISPLAY PDF
    // =========================

    content.innerHTML = `

        <div class="pdf-reader">

            <iframe
                src="${pdfUrl}"
                width="100%"
                height="750px"
                style="
                    border: none;
                    border-radius: 8px;
                "
                title="${currentBook.title}"
            >
            </iframe>

        </div>

    `;

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
// THEME
// =========================

const themeBtn =
    document.getElementById(
        "themeBtn"
    );


if (themeBtn) {

    const savedTheme =
        localStorage.getItem(
            "theme"
        );


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

        themeBtn.textContent =
            "☀️";

    }


    themeBtn.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark-mode"
            );


            if (
                document.body.classList.contains(
                    "dark-mode"
                )
            ) {

                localStorage.setItem(
                    "theme",
                    "dark"
                );

                themeBtn.textContent =
                    "☀️";

            }

            else {

                localStorage.setItem(
                    "theme",
                    "light"
                );

                themeBtn.textContent =
                    "🌙";

            }

        }
    );

}


// =========================
// START
// =========================

loadReaderBook();
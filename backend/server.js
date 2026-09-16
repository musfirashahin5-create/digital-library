const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const db = require("./db");

const app = express();


// =========================
// MIDDLEWARE
// =========================

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// =========================
// FILE UPLOAD SETUP
// =========================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        if (file.fieldname === "coverImage") {

            cb(
                null,
                path.join(__dirname, "uploads", "covers")
            );

        }

        else if (file.fieldname === "bookPdf") {

            cb(
                null,
                path.join(__dirname, "uploads", "pdfs")
            );

        }

        else {

            cb(
                new Error("Invalid file field")
            );

        }

    },

    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);

    }

});


// =========================
// FILE FILTER
// =========================

const fileFilter = function (req, file, cb) {

    // Cover Image
    if (file.fieldname === "coverImage") {

        const allowedImages = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/webp"
        ];

        if (allowedImages.includes(file.mimetype)) {

            cb(null, true);

        } else {

            cb(
                new Error(
                    "Only JPG, JPEG, PNG and WEBP images are allowed!"
                )
            );

        }

    }

    // Book PDF
    else if (file.fieldname === "bookPdf") {

        if (file.mimetype === "application/pdf") {

            cb(null, true);

        } else {

            cb(
                new Error("Only PDF files are allowed!")
            );

        }

    }

    else {

        cb(
            new Error("Invalid file type!")
        );

    }

};


// =========================
// MULTER
// =========================

const upload = multer({

    storage: storage,

    fileFilter: fileFilter,

    limits: {

        fileSize: 20 * 1024 * 1024

    }

});


// =========================
// SERVE UPLOADED FILES
// =========================

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);


// =========================
// index ROUTE
// =========================

app.get("/", (req, res) => {

    res.send(
        "Digital Library Backend is Running!"
    );

});


// =====================================================
// USER AUTHENTICATION
// =====================================================


// =========================
// REGISTER USER
// =========================

app.post(
    "/api/register",
    (req, res) => {

        const {
            name,
            email,
            password
        } = req.body;


        // -------------------------
        // Validation
        // -------------------------

        if (
            !name ||
            !email ||
            !password
        ) {

            return res.status(400).json({

                error:
                    "Name, email and password are required"

            });

        }


        const cleanName =
            name.trim();

        const cleanEmail =
            email.trim().toLowerCase();

        const cleanPassword =
            password.trim();


        if (!cleanName) {

            return res.status(400).json({

                error:
                    "Name is required"

            });

        }


        if (!cleanEmail) {

            return res.status(400).json({

                error:
                    "Email is required"

            });

        }


        if (!cleanPassword) {

            return res.status(400).json({

                error:
                    "Password is required"

            });

        }


        // -------------------------
        // Check existing email
        // -------------------------

        const checkSql = `

            SELECT id
            FROM users
            WHERE LOWER(email) = ?

        `;


        db.query(
            checkSql,
            [cleanEmail],
            (checkErr, results) => {

                if (checkErr) {

                    console.error(
                        "❌ Register check error:",
                        checkErr
                    );

                    return res.status(500).json({

                        error:
                            "Failed to check user"

                    });

                }


                // Email already exists
                if (results.length > 0) {

                    return res.status(409).json({

                        error:
                            "Email already registered"

                    });

                }


                // -------------------------
                // Insert new user
                // -------------------------

                const insertSql = `

                    INSERT INTO users
                    (
                        name,
                        email,
                        password,
                        role
                    )

                    VALUES (?, ?, ?, ?)

                `;


                db.query(

                    insertSql,

                    [
                        cleanName,
                        cleanEmail,
                        cleanPassword,
                        "user"
                    ],

                    (insertErr, result) => {

                        if (insertErr) {

                            console.error(
                                "❌ Register error:",
                                insertErr
                            );

                            return res.status(500).json({

                                error:
                                    "Failed to register user"

                            });

                        }


                        res.status(201).json({

                            message:
                                "Registration successful",

                            user: {

                                id:
                                    result.insertId,

                                name:
                                    cleanName,

                                email:
                                    cleanEmail,

                                role:
                                    "user"

                            }

                        });

                    }

                );

            }

        );

    }

);


// =========================
// login USER
// =========================

app.post(
    "/api/login",
    (req, res) => {

        const {
            email,
            password
        } = req.body;


        // -------------------------
        // Validation
        // -------------------------

        if (
            !email ||
            !password
        ) {

            return res.status(400).json({

                error:
                    "Email and password are required"

            });

        }


        const cleanEmail =
            email.trim().toLowerCase();

        const cleanPassword =
            password.trim();


        // -------------------------
        // Find user
        // -------------------------

        const sql = `

            SELECT
                id,
                name,
                email,
                password,
                role

            FROM users

            WHERE LOWER(email) = ?

            LIMIT 1

        `;


        db.query(

            sql,

            [cleanEmail],

            (err, results) => {

                if (err) {

                    console.error(
                        "❌ login error:",
                        err
                    );

                    return res.status(500).json({

                        error:
                            "login failed"

                    });

                }


                // User doesn't exist
                if (
                    results.length === 0
                ) {

                    return res.status(401).json({

                        error:
                            "Invalid email or password"

                    });

                }


                const user =
                    results[0];


                // -------------------------
                // Check password
                // -------------------------

                if (
                    user.password !==
                    cleanPassword
                ) {

                    return res.status(401).json({

                        error:
                            "Invalid email or password"

                    });

                }


                // -------------------------
                // Successful login
                // -------------------------

                res.json({

                    message:
                        "login successful",

                    user: {

                        id:
                            user.id,

                        name:
                            user.name,

                        email:
                            user.email,

                        role:
                            user.role

                    }

                });

            }

        );

    }

);


// =========================
// GET USER BY EMAIL
// =========================

app.get(
    "/api/users/by-email/:email",

    (req, res) => {

        const email =
            req.params.email
                .trim()
                .toLowerCase();


        const sql = `

            SELECT
                id,
                name,
                email,
                role

            FROM users

            WHERE LOWER(email) = ?

        `;


        db.query(

            sql,

            [email],

            (err, results) => {

                if (err) {

                    console.error(
                        "❌ Error fetching user:",
                        err
                    );

                    return res.status(500).json({

                        error:
                            "Failed to fetch user"

                    });

                }


                if (
                    results.length === 0
                ) {

                    return res.status(404).json({

                        error:
                            "User not found"

                    });

                }


                res.json(
                    results[0]
                );

            }

        );

    }

);


// =====================================================
// BOOK APIs
// =====================================================


// =========================
// GET ALL BOOKS
// =========================

app.get(
    "/api/books",
    (req, res) => {

        const sql =
            "SELECT * FROM books";


        db.query(
            sql,
            (err, results) => {

                if (err) {

                    console.error(
                        "❌ Error fetching books:",
                        err
                    );

                    return res.status(500).json({

                        error:
                            "Failed to fetch books"

                    });

                }


                res.json(results);

            }
        );

    }
);


// =========================
// ADD NEW BOOK
// =========================

app.post(

    "/api/books",

    upload.fields([

        {
            name: "coverImage",
            maxCount: 1
        },

        {
            name: "bookPdf",
            maxCount: 1
        }

    ]),

    (req, res) => {

        try {

            const {
                title,
                author,
                category,
                year,
                pages,
                rating,
                description
            } = req.body;


            const coverImage =
                req.files &&
                    req.files.coverImage
                    ? req.files.coverImage[0]
                    : null;


            const bookPdf =
                req.files &&
                    req.files.bookPdf
                    ? req.files.bookPdf[0]
                    : null;


            // -------------------------
            // Validation
            // -------------------------

            if (
                !title ||
                !author ||
                !category
            ) {

                return res.status(400).json({

                    error:
                        "Title, author and category are required"

                });

            }


            if (!coverImage) {

                return res.status(400).json({

                    error:
                        "Cover image is required"

                });

            }


            if (!bookPdf) {

                return res.status(400).json({

                    error:
                        "Book PDF is required"

                });

            }


            // -------------------------
            // File paths
            // -------------------------

            const coverImagePath =
                "uploads/covers/" +
                coverImage.filename;


            const pdfFilePath =
                "uploads/pdfs/" +
                bookPdf.filename;


            // -------------------------
            // Insert book
            // -------------------------

            const sql = `

                INSERT INTO books

                (
                    title,
                    author,
                    category,
                    year,
                    pages,
                    rating,
                    cover_image,
                    pdf_file,
                    description
                )

                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)

            `;


            db.query(

                sql,

                [
                    title,
                    author,
                    category,
                    year || null,
                    pages || null,
                    rating || null,
                    coverImagePath,
                    pdfFilePath,
                    description || ""
                ],

                (err, result) => {

                    if (err) {

                        console.error(
                            "❌ Error adding book:",
                            err
                        );

                        return res.status(500).json({

                            error:
                                "Failed to add book"

                        });

                    }


                    res.status(201).json({

                        message:
                            "Book added successfully",

                        book_id:
                            result.insertId,

                        cover_image:
                            coverImagePath,

                        pdf_file:
                            pdfFilePath

                    });

                }

            );

        }

        catch (error) {

            console.error(
                "❌ Upload Error:",
                error
            );

            res.status(500).json({

                error:
                    "File upload failed"

            });

        }

    }

);


// =========================
// GET SINGLE BOOK
// =========================

app.get(
    "/api/books/:id",
    (req, res) => {

        const bookId =
            req.params.id;


        const sql =
            "SELECT * FROM books WHERE id = ?";


        db.query(

            sql,

            [bookId],

            (err, results) => {

                if (err) {

                    console.error(
                        "❌ Error fetching book:",
                        err
                    );

                    return res.status(500).json({

                        error:
                            "Failed to fetch book"

                    });

                }


                if (
                    results.length === 0
                ) {

                    return res.status(404).json({

                        error:
                            "Book not found"

                    });

                }


                res.json(
                    results[0]
                );

            }

        );

    }

);


// =========================
// UPDATE BOOK
// =========================

app.put(

    "/api/books/:id",

    upload.fields([

        {
            name: "coverImage",
            maxCount: 1
        },

        {
            name: "bookPdf",
            maxCount: 1
        }

    ]),

    (req, res) => {

        const bookId =
            req.params.id;


        const {
            title,
            author,
            category,
            year,
            pages,
            rating,
            description
        } = req.body;


        const newCover =
            req.files &&
                req.files.coverImage
                ? req.files.coverImage[0]
                : null;


        const newPdf =
            req.files &&
                req.files.bookPdf
                ? req.files.bookPdf[0]
                : null;


        // -------------------------
        // Get existing book
        // -------------------------

        const getSql =
            "SELECT * FROM books WHERE id = ?";


        db.query(

            getSql,

            [bookId],

            (err, results) => {

                if (err) {

                    console.error(
                        "❌ Error finding book:",
                        err
                    );

                    return res.status(500).json({

                        error:
                            "Failed to find book"

                    });

                }


                if (
                    results.length === 0
                ) {

                    return res.status(404).json({

                        error:
                            "Book not found"

                    });

                }


                const oldBook =
                    results[0];


                const coverImagePath =
                    newCover
                        ? "uploads/covers/" +
                        newCover.filename
                        : oldBook.cover_image;


                const pdfFilePath =
                    newPdf
                        ? "uploads/pdfs/" +
                        newPdf.filename
                        : oldBook.pdf_file;


                // -------------------------
                // Update book
                // -------------------------

                const updateSql = `

                    UPDATE books

                    SET
                        title = ?,
                        author = ?,
                        category = ?,
                        year = ?,
                        pages = ?,
                        rating = ?,
                        cover_image = ?,
                        pdf_file = ?,
                        description = ?

                    WHERE id = ?

                `;


                db.query(

                    updateSql,

                    [
                        title,
                        author,
                        category,
                        year || null,
                        pages || null,
                        rating || null,
                        coverImagePath,
                        pdfFilePath,
                        description || "",
                        bookId
                    ],

                    (updateErr, result) => {

                        if (updateErr) {

                            console.error(
                                "❌ Error updating book:",
                                updateErr
                            );

                            return res.status(500).json({

                                error:
                                    "Failed to update book"

                            });

                        }


                        if (
                            result.affectedRows === 0
                        ) {

                            return res.status(404).json({

                                error:
                                    "Book not found"

                            });

                        }


                        res.json({

                            message:
                                "Book updated successfully",

                            book_id:
                                bookId,

                            cover_image:
                                coverImagePath,

                            pdf_file:
                                pdfFilePath

                        });

                    }

                );

            }

        );

    }

);


// =========================
// DELETE BOOK
// =========================

app.delete(
    "/api/books/:id",

    (req, res) => {

        const bookId =
            req.params.id;


        // -------------------------
        // Delete favorites
        // -------------------------

        const deleteFavoritesSql = `

            DELETE FROM favorites
            WHERE book_id = ?

        `;


        db.query(

            deleteFavoritesSql,

            [bookId],

            (favoriteErr) => {

                if (favoriteErr) {

                    console.error(
                        "❌ Error deleting favorites:",
                        favoriteErr
                    );

                    return res.status(500).json({

                        error:
                            "Failed to delete related favorites"

                    });

                }


                // -------------------------
                // Delete book
                // -------------------------

                const deleteBookSql = `

                    DELETE FROM books
                    WHERE id = ?

                `;


                db.query(

                    deleteBookSql,

                    [bookId],

                    (bookErr, result) => {

                        if (bookErr) {

                            console.error(
                                "❌ Error deleting book:",
                                bookErr
                            );

                            return res.status(500).json({

                                error:
                                    "Failed to delete book"

                            });

                        }


                        if (
                            result.affectedRows === 0
                        ) {

                            return res.status(404).json({

                                error:
                                    "Book not found"

                            });

                        }


                        res.json({

                            message:
                                "Book deleted successfully"

                        });

                    }

                );

            }

        );

    }

);


// =====================================================
// FAVORITES APIs
// =====================================================


// =========================
// ADD BOOK TO FAVORITES
// =========================

app.post(
    "/api/favorites",

    (req, res) => {

        const {
            user_id,
            book_id
        } = req.body;


        if (
            !user_id ||
            !book_id
        ) {

            return res.status(400).json({

                error:
                    "user_id and book_id are required"

            });

        }


        const sql = `

            INSERT INTO favorites
            (
                user_id,
                book_id
            )

            VALUES (?, ?)

        `;


        db.query(

            sql,

            [
                user_id,
                book_id
            ],

            (err, result) => {

                if (err) {

                    if (
                        err.code ===
                        "ER_DUP_ENTRY"
                    ) {

                        return res.status(409).json({

                            message:
                                "Book already in favorites"

                        });

                    }


                    console.error(
                        "❌ Error adding favorite:",
                        err
                    );

                    return res.status(500).json({

                        error:
                            "Failed to add favorite"

                    });

                }


                res.status(201).json({

                    message:
                        "Book added to favorites",

                    favorite_id:
                        result.insertId

                });

            }

        );

    }

);


// =========================
// REMOVE BOOK FROM FAVORITES
// =========================

app.delete(
    "/api/favorites/:userId/:bookId",

    (req, res) => {

        const {
            userId,
            bookId
        } = req.params;


        const sql = `

            DELETE FROM favorites

            WHERE
                user_id = ?
                AND book_id = ?

        `;


        db.query(

            sql,

            [
                userId,
                bookId
            ],

            (err, result) => {

                if (err) {

                    console.error(
                        "❌ Remove favorite error:",
                        err
                    );

                    return res.status(500).json({

                        error:
                            "Failed to remove favorite"

                    });

                }


                if (
                    result.affectedRows === 0
                ) {

                    return res.status(404).json({

                        error:
                            "Favorite not found"

                    });

                }


                res.json({

                    message:
                        "Favorite removed successfully"

                });

            }

        );

    }

);


// =========================
// GET USER FAVORITES
// =========================

app.get(
    "/api/favorites/:userId",

    (req, res) => {

        const userId =
            req.params.userId;


        const sql = `

            SELECT

                favorites.id AS favorite_id,

                books.id,
                books.title,
                books.author,
                books.category,
                books.year,
                books.pages,
                books.rating,
                books.description,
                books.cover_image,
                books.pdf_file

            FROM favorites

            JOIN books
                ON favorites.book_id = books.id

            WHERE favorites.user_id = ?

            ORDER BY
                favorites.created_at DESC

        `;


        db.query(

            sql,

            [userId],

            (err, results) => {

                if (err) {

                    console.error(
                        "❌ Error fetching favorites:",
                        err
                    );

                    return res.status(500).json({

                        error:
                            "Failed to fetch favorites"

                    });

                }


                res.json(results);

            }

        );

    }

);


// =====================================================
// ERROR HANDLER
// =====================================================

app.use(
    (err, req, res, next) => {

        console.error(
            "❌ Server Error:",
            err.message
        );


        if (
            err.code ===
            "LIMIT_FILE_SIZE"
        ) {

            return res.status(400).json({

                error:
                    "File size must be below 20MB"

            });

        }


        return res.status(400).json({

            error:
                err.message ||
                "Something went wrong"

        });

    }
);


// =====================================================
// START SERVER
// =====================================================


const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
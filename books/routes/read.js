let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Book = require('../models/booklist');

// Middleware to protect routes
function requireAuth(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}

// ----------------- CRUD Operations ----------------- //

// READ - show all books
router.get('/', requireAuth, async (req, res, next) => {
    try {
        const bookList = await Book.find();
        res.render('books', { 
            title: 'Books', 
            bookList: bookList, 
            displayName: req.user ? req.user.displayName : "" 
        });
    } catch (err) {
        console.error(err);
        res.render('books', { 
            title: 'Books', 
            bookList: [], 
            displayName: req.user ? req.user.displayName : "", 
            error: 'Error on Server' 
        });
    }
});

// ADD - get form
router.get('/add', requireAuth, async (req, res, next) => {
    try {
        res.render('add', { 
            title: 'Add Book', 
            displayName: req.user ? req.user.displayName : "" 
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// ADD - post form
router.post('/add', requireAuth, async (req, res, next) => {
    try {
        let newBook = new Book({
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            status: req.body.status,
            rating: req.body.rating,
            review: req.body.review,
        });
        await Book.create(newBook);
        res.redirect('/books');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// EDIT - get form
router.get('/edit/:id', requireAuth, async (req, res, next) => {
    try {
        const id = req.params.id;
        const bookToEdit = await Book.findById(id);
        res.render('edit', {
            title: 'Edit Book',
            book: bookToEdit,
            displayName: req.user ? req.user.displayName : ""
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// EDIT - post form
router.post('/edit/:id', requireAuth, async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedBook = {
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            status: req.body.status,
            rating: req.body.rating,
            review: req.body.review,
        };
        await Book.findByIdAndUpdate(id, updatedBook);
        res.redirect('/books');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// DELETE - remove book
router.get('/delete/:id', requireAuth, async (req, res, next) => {
    try {
        const id = req.params.id;
        await Book.deleteOne({ _id: id });
        res.redirect('/books');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;

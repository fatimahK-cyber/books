let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Book = require('../models/booklist');

function requireAuth(req, res, next) {
    // check if the user is logged in
    if(!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}

//CRUD Operations

/* READ */
router.get('/', async(req, res, next)=> {
    try {
        const bookList = await Book.find();
        res.render('books', {title: 'Books', bookList: bookList, displayName: req.user ? req.user.displayName : ""});

    }
    catch(err) {
        console.error(err);
        res.render('books', {
            error: 'Error on Server'
        })
    }
})
/* get the data  - create operation*/
router.get('/add', async(req, res, next)=> {
    try
    {
        res.render('add', {title: 'Add Book', displayName: req.user ? req.user.displayName : ""});
    }
    catch(err) {
        console.error(err);
        next(err);
        }
    
    })


/* post the data  - create operation*/
router.post('/add', async(req, res, next)=> {
    try
    {
        let newBook = Book({
            "title": req.body.title,
            "author": req.body.author,
            "genre": req.body.genre,
            "status": req.body.status,
            "rating": req.body.rating,
            "review": req.body.review,
        });
        Book.create(newBook).then(()=>{
            res.redirect('/books');
        });
    }
    catch(err) {
        console.error(err);
        next(err);
        }
    
    })


/* get the route for update  - update operation*/
router.get('/edit/:id', async(req, res, next)=> {
    try
    {
        const id = req.params.id;
        const bookToEdit = await Book.findById(id);
        res.render('edit', {
            title: 'Edit Book',
             book: bookToEdit,
                displayName: req.user ? req.user.displayName : ""
            });
    }
    catch(err) {
        console.error(err);
        next(err);
        }
    }
    )


/* post the route for update  - create operation*/
router.post('/edit/:id', async(req, res, next)=> {
    try
    {
        let id = req.params.id;
        let updatedBook = Book({
            "_id": id,
            "title": req.body.title,
            "author": req.body.author,
            "genre": req.body.genre,
            "status": req.body.status,
            "rating": req.body.rating,
            "review": req.body.review,
        });
        Book.findByIdAndUpdate(id, updatedBook).then(()=>{
            res.redirect('/books');
        });
    }
    catch(err) {
        console.error(err);
        next(err);
        }
    
    })


/* get the route for performing delete  - delete operation*/
router.get('/delete/:id', async(req, res, next)=> {
    try
    {
        let id = req.params.id;
        Book.deleteOne({_id: id}).then(()=>{
            res.redirect('/books');
        })
    }
    catch(err) {
    
        console.error(err);
        next(err);
        }
    
    })






module.exports = router;
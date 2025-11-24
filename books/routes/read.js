let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Book = require('../config/booklist');

//CRUD Operations

/* READ */
router.get('/', async(req, res, next)=> {
    try {
        const bookList = await Book.find();
        res.render('books', {title: 'Books', bookList: bookList});

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
        res.render('add', {title: 'Add Book'});
    }
    catch(err) {
        console.error(err);
        res.render('add', {
            error: 'Error on Server'
        })
    }
    });

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
        res.render('add', {
            error: 'Error on Server'
        })
    }
    });


/* get the route for update  - update operation*/
router.get('/edit/:id', async(req, res, next)=> {
    try
    {
        res.render('add', {title: 'Add Book'});
    }
    catch(err) {
        console.error(err);
        res.render('add', {
            error: 'Error on Server'
        })
    }
    });


/* post the route for update  - create operation*/
router.post('/edit/:id', async(req, res, next)=> {
    try
    {
        res.render('add', {title: 'Add Book'});
    }
    catch(err) {
        console.error(err);
        res.render('add', {
            error: 'Error on Server'
        })
    }
    });


/* get the route for performing delete  - delete operation*/
router.get('/delete/:id', async(req, res, next)=> {
    try
    {
        res.render('add', {title: 'Add Book'});
    }
    catch(err) {
        console.error(err);
        res.render('add', {
            error: 'Error on Server'
        })
    }
    });





module.exports = router;
let mongoose = require('mongoose');

let bookModel = mongoose.Schema({
    title: String,
    author: String,
    genre: String,
    status: String,
    rating: Number,
    review: String,
    
},
    {
    collection: "My Books"
    }
);



module.exports = mongoose.model('Book', bookModel);

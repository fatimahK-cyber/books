// Import mongoose
let mongoose = require('mongoose');

// Define the structure for a book entry
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
});

// Make the model available to use in other files
module.exports = mongoose.model('Book', bookModel);

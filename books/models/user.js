// Bring in mongoose and passport-local-mongoose
let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');

// Set up how a user will be stored in the database
let userSchema = new mongoose.Schema({
    username: {
        type: String,
        default: '',
        trim: true,
        required: 'Username is required'
    },
    email: {
        type: String,
        default: '',
        trim: true,
        required: 'Email is required'
    },
    displayName: {
        type: String,
        default: '',
        trim: true,
        required: 'Display Name is required'
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'users'
});

// Settings for the authentication plugin
let options = { missingPasswordError: 'Wrong / Missing Password' };
userSchema.plugin(passportLocalMongoose, options);

// Create the user model
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = { User };

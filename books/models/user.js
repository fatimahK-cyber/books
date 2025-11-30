const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default;


const userSchema = new mongoose.Schema({
    username: { type: String, required: 'Username is required', trim: true },
    email: { type: String, required: 'Email is required', trim: true },
    displayName: { type: String, required: 'Display Name is required', trim: true },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
}, {
    collection: 'users'
});

// Use passport-local-mongoose correctly with v9+
userSchema.plugin(passportLocalMongoose, {
    usernameField: "username",
    errorMessages: {
        MissingPasswordError: 'Wrong / Missing Password'
    }
});

const User = mongoose.model('User', userSchema);
module.exports = { User };

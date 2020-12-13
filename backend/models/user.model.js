const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {type: String, required: true, trim: true, minlength: 3},
    lastname: {type: String, required: true, trim: true, minlength: 3},
    username: {type: String, required: true, trim: true, minlength: 3, unique: true},
    password: {type: String, required: true, minlength: 5},
    permission: {type: String, required: true},
    favourites: {type: Array},
    shopping_cart: {type: Array},
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;

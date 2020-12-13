const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: {type: String, required: true, trim: true, minlength: 1},
    price: {type: Number, required: true},
    description: {type: String, required: true, trim: true, minlength: 1},
    img: {type: String, trim: true, minlength: 1},
    category: {type: String, required: true, minlength: 1},
    creator: {type: String, required: true, minlength: 1},
}, {
    timestamps: true
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
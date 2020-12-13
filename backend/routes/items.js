const router = require('express').Router()
// let User = require("../models/user.model")
let Item = require("../models/items.model")
const User = require('../models/user.model')

router.route('/').get((req, res) => {
    const {token} = req.headers
    const {price = '[0,100000]', category = '[]', search = ""} = req.query

    let _price = JSON.parse(price)
    let _category = JSON.parse(category)

    
    User.findById(token)
        .then(({permission, favourites, shopping_cart }) => {

            Item.find({price: {$gt: _price[0], $lt: _price[1]}, category: {$in: _category}})
                .then(items => {
                    if(permission == "admin" || permission == "owner") {
                        res.json(
                            items.map(({_id, name, description, price, img, updatedAt, category}) => ({
                                name,
                                description,
                                price,
                                category,
                                img,
                                editable: true,
                                fav: favourites.includes(_id),
                                shop_cart: shopping_cart.includes(_id),
                                updatedAt,
                                _id
                            })).filter(({name, description}) => 
                                name.toLowerCase().includes(search) || 
                                description.toLowerCase().includes(search)
                            )
                        )
                    } else {
                        res.json(
                            items.map(({_id, name, description, price, img, updatedAt, category, creator}) => ({
                                name,
                                description,
                                price,
                                category,
                                img,
                                editable: creator == token ? true : false,
                                fav: favourites.includes(_id),
                                shop_cart: shopping_cart.includes(_id),
                                updatedAt,
                                _id
                            })).filter(({name, description}) => 
                                name.toLowerCase().includes(search) || 
                                description.toLowerCase().includes(search)
                            )
                        )
                    }
                }).catch(err => res.status(400).json('Error: ' + err));
        }).catch(err => res.status(401).json('Invalid token: ' + err))
})

router.route('/add').post((req, res) => {
    const {name, price, description, category, img} = req.body;
    const {token} = req.headers

    if(category == "phone" 
        || category == "laptop" 
        || category == "tv" 
        || category == "watch" 
        || category == "headphones" 
        || category == "other"
    ) {
        const newItem = new Item({name, price, description, img, category, creator: token})

        newItem.save()
            .then((data) => {
                res.json("Item added")
            })
            .catch(err => {
                res.status(400).json(err)
                console.log(err)
            })
    } else {
        res.status(401).json("wrong category")
    }
})

router.route('/update').put((req, res) => {
    const {token} = req.headers;
    const {_id, name, price, description, category, img} = req.body

    if(category == "phone" 
        || category == "laptop" 
        || category == "tv" 
        || category == "watch" 
        || category == "headphones" 
        || category == "other"
    ) {
        User.findById(token)
            .then(({permission}) => {
                if(permission == "admin" || permission == "owner") {
                    Item.updateOne({_id}, {
                        $set: {name, price, description, category, img}
                    }).then(data => {
                        if(data.n == 0 && data.nModified == 0) {
                            res.status(400).json("wrong id")
                        } else {
                            res.json("item updated successfully")
                        }
                    }).catch(err => res.status(400).json(err))
                } else {
                    Item.updateOne({_id, creator: token}, {
                        $set: {name, price, description, category, img}
                    }).then(data => {
                        if(data.n == 0 && data.nModified == 0) {
                            res.status(400).json("wrong id")
                        } else {
                            res.json("item updated successfully")
                        }
                    }).catch(err => {
                        console.log(err)
                        res.status(400).json(err)
                    })
                }
            }).catch(err => res.status(401).json("wrong token"))
    } else {
        res.status(401).json("wrong category")
    }
})

router.route('/delete').delete((req, res) => {
    const {token} = req.headers;
    const {_id} = req.body

    User.findById(token)
        .then(({permission}) => {
            if(permission == "admin" || permission == "owner") {
                Item.deleteOne({_id})
                    .then(() => res.json("Item deleted successfully"))
                    .catch(err => res.status(400).json(err))
            } else {
                Item.deleteOne({_id, creator: token})
                    .then((data) => {
                        if(data.n == 0 && data.nModified == 0) {
                            res.status(400).json("wrong id")
                        } else {
                            res.json("Item deleted successfully")
                        }
                    }).catch(err => {
                        console.log(err)
                        res.status(400).json(err)
                    })
            }
        }).catch(err => res.status(401).json("wrong token"))

})

// ****************** Favourites **********************

router.route('/favourite').get((req, res) => {
    const {token} = req.headers

    User.findById(token)
        .then(({favourites}) => {
            Item.find({_id: {$in: favourites}})
                .then(data => {
                    res.json(data.map(({_id, name, description, price, img, updatedAt, category}) => ({
                        name, description, price, category, img, updatedAt, _id
                    })))
                }).catch(err => res.status(400).json(err))
        }).catch(err => res.status(401).json("wrong token"))
})

router.route('/favourite').put((req, res) => {
    const {token} = req.headers
    const {_id} = req.body

    User.updateOne({_id: token}, {$addToSet: {favourites: _id}})
        .then(data => res.json("success"))
        .catch(err => res.status(401).json("wrong token"))
})

router.route('/favourite').delete((req, res) => {
    const {token} = req.headers
    const {_id} = req.body

    User.updateOne({_id: token}, {$pull: {favourites: _id}})
        .then(() => res.json("success"))
        .catch(err => res.status(401).json("wrong token")) 
})

// ************************** Shopping-cart ***************************

router.route('/shopping-cart').get((req, res) => {
    const {token} = req.headers

    User.findById(token)
        .then(({shopping_cart}) => {
            Item.find({_id: {$in: shopping_cart}})
                .then(data => {
                    res.json(data.map(({_id, name, description, price, img, updatedAt, category}) => ({
                        name, description, price, category, img, updatedAt, _id
                    })))
                }).catch(err => res.status(400).json(err))
        }).catch(err => res.status(401).json("wrong token"))
})

router.route('/shopping-cart').put((req, res) => {
    const {token} = req.headers
    const {_id} = req.body

    User.updateOne({_id: token}, {$addToSet: {shopping_cart: _id}})
        .then(data => res.json("success"))
        .catch(err => res.status(401).json("wrong token")) 
})

router.route('/shopping-cart').delete((req, res) => {
    const {token} = req.headers
    const {_id} = req.body

    User.updateOne({_id: token}, {$pull: {shopping_cart: _id}})
    .then(() => res.json("success"))
    .catch(err => res.status(401).json("wrong token")) 
})

module.exports = router;
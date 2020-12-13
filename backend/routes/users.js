const router = require('express').Router()
let User = require("../models/user.model")

router.route('/').get((req, res) => {
    const {token} = req.headers

    User.findById(token)
        .then(({permission}) => {
            if(permission == "owner") {
                User.find()
                    .then(users => {
                        res.json(users.filter(({permission}) => permission != "owner")
                            .map(({firstname, lastname, username, createdAt, updatedAt, permission}) => ({
                                firstname, lastname, username, createdAt, updatedAt, permission
                            }))
                        )
                    }).catch(err => res.status(400).json('Error: ' + err));
            } else if(permission == "admin") {
                User.find()
                    .then(users => {
                        res.json(users.filter(({permission}) => permission != "owner" && permission != "admin")
                            .map(({firstname, lastname, username, createdAt, updatedAt}) => ({
                                firstname, lastname, username, createdAt, updatedAt
                            }))
                        )
                    }).catch(err => res.status(400).json('Error: ' + err));
            } else {
                res.status(401).json("You are not admin!")
            }
        }).catch(err => res.status(401).json("Invalid token: " + err))
})

router.route('/all').get((req, res) => {
    const {token} = req.headers

    User.findById(token)
        .then(({permission}) => {
            if(permission == "owner") {
                User.find()
                    .then(users => res.json(users))
                    .catch(err => res.status(400).json('Error: ' + err));
            } else {
                res.status(401).json("You are not owner!")
            }
        }).catch(err => res.status(401).json("Invalid token: " + err))
})

router.route('/reg').post((req, res) => {
    const {firstname, lastname, username, password} = req.body;

    const newUser = new User({firstname, lastname, username, password, permission: "user", favourites: [], shopping_cart: []})

    newUser.save()
        .then(data => {
            res.json({
                token: data._id,
                firstname: data.firstname,
                lastname: data.lastname,
                permission: data.permission
            })
        })
        .catch(err => {
            let errors = {
                firstname: 0,
                lastname: 0,
                username: 0,
                password: 0,
            }

            if(err.keyPattern) {
                res.status(400).json({...errors, username: 3})
            } else {
                errors.firstname = firstname.length < 3 ? 1 : 0;
                errors.lastname = lastname.length < 3 ? 1 : 0;
                errors.username = username.length < 3 ? 1 : 0;
                errors.password = password.length < 5 ? 2 : 0;
                res.status(400).json(errors)
            }
        });
}) 

router.route('/setAdmin').post((req, res) => {
    const {token} = req.headers;
    const {username} = req.body;

    User.findById(token)
        .then(({permission}) => {
            if(permission == "owner") {
                User.updateOne({username}, {$set: {permission: "admin"}})
                    .then(() => res.json("success"))
                    .catch(err => res.status(400).json(err))
            } else {
                res.status(401).json("You are not owner!")
            }
        }).catch(err => res.status(401).json("Invalid token: " + err))
})

router.route('/setUser').post((req, res) => {
    const {token} = req.headers;
    const {username} = req.body;

    User.findById(token)
        .then(({permission}) => {
            if(permission == "owner") {
                User.updateOne({username}, {$set: {permission: "user"}})
                    .then(() => res.json("success"))
                    .catch(err => res.status(400).json(err))
            } else {
                res.status(401).json("You are not owner!")
            }
        }).catch(err => res.status(401).json("Invalid token: " + err))
})

router.route('/login').post((req, res) => {
    const {username, password} = req.body;

    User.findOne({username, password})
        .then(result => {
            if(result) {
                res.json({
                    token: result._id,
                    firstname: result.firstname,
                    lastname: result.lastname,
                    permission: result.permission
                })
            } else {
                res.status(400).json("Login yoki parol xato")
            } 
        })
        .catch(err => res.status(400).json("Error: " + err))
})

router.route('/edit').put((req, res) => {
    const {token} = req.headers
    const {firstname, lastname, password} = req.body

    let errors = {
        firstname: 0,
        lastname: 0,
        password: 0,
    }

    errors.firstname = firstname.length < 3 ? 1 : /^[a-zA-Z]+$/.test(firstname) ? 0 : 5
    errors.lastname = lastname.length < 3 ? 1 : /^[a-zA-Z]+$/.test(lastname) ? 0 : 5
    errors.password = password.length < 5 ? 2 : 0

    if(errors.firstname == 0 && errors.lastname == 0 && errors.password == 0) {
        User.updateOne({_id: token}, {
            firstname, lastname, password
        }).then(data => {
            res.json("user updated")
            // console.log(data)
        }).catch(err => {
            res.status(401).json("wrong token")
            // console.log(err)
        })
    } else {
        res.status(400).json(errors)
    }

})

module.exports = router;
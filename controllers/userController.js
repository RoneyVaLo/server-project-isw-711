const User = require("../models/userModel");

const userGet = (req, res) => {
    if (req.query && req.query.id) {

        //* Get a user by id

        User.findById(req.query.id)
            .then((user) => {
                res.json(user);
            })
            .catch(err => {
                res.status(404);
                console.log('error while queryting the user', err)
                res.json({ error: "User doesnt exist" })
            });
    } else if (req.body.user_name && req.body.password) {

        //* Get a user by Username and Password

        const { user_name, password } = req.body;
        User.findOne({ user_name, password }).then((user) => {
            res.json(user);
        }).catch(err => {
            res.status(404);
            console.log('error while queryting the user', err)
            res.json({ error: "User doesnt exist" })
        });
    } else {

        //* Get all existing users in the database

        User.find()
            .then(users => {
                res.json(users);
            })
            .catch(err => {
                res.status(422);
                res.json({ "error": err });
            });
    }
};

const userPost = async (req, res) => {
    let user = new User();

    try {
        user.first_name = req.body.first_name;
        user.last_name = req.body.last_name;
        user.age = req.body.age;
        user.role = req.body.role;
        user.user_name = req.body.user_name;
        user.password = req.body.password;
        user.profile_image = req.body.profile_image;

        // TODO: COMPROBAR SI ES NECESARIO USAR EL "await" O SE PUEDE ELIMINAR
        await user.save()
            .then(data => {
                res.status(201); // CREATED
                res.header({
                    'location': `/api/users/?id=${data.id}`
                });
                res.json(data);
            })
            .catch(err => {
                res.status(422);
                console.log('error while saving the user', err);
                res.json({
                    error: 'There was an error saving the user'
                });
            });

    } catch (error) {
        res.status(422);
        console.log('error while saving the user')
        res.json({
            error: 'No valid data provided for user'
        });
    }
};

const userPatch = (req, res) => {
    if (req.query && req.query.id) {
        User.findById(req.query.id).then(user => {

            user.first_name = req.body.first_name ? req.body.first_name : user.first_name;
            user.last_name = req.body.last_name ? req.body.last_name : user.last_name;
            user.age = req.body.age ? req.body.age : user.age;
            user.role = req.body.role ? req.body.role : user.role;
            user.user_name = req.body.user_name ? req.body.user_name : user.user_name;
            user.password = req.body.password ? req.body.password : user.password;
            user.profile_image = req.body.profile_image ? req.body.profile_image : user.profile_image;

            user.save().then(() => {
                res.status(200);
                res.json(user);
            }).catch(err => {
                res.status(422);
                console.log('error while saving the user', err)
                res.json({
                    error: 'There was an error saving the user'
                });
            });

        })
            .catch(err => {
                res.status(404);
                console.log('error while queryting the user', err)
                res.json({ error: "User doesnt exist" })
            });
    } else {
        res.status(404);
        res.json({ error: "User doesn't exist" });
    };
};

const userDelete = (req, res) => {
    if (req.query && req.query.id) {
        User.findById(req.query.id)
            .then(user => {
                user.deleteOne()
                    .then(() => {
                        res.status(204);
                        res.json({});
                    })
                    .catch(err => {
                        res.status(422);
                        console.log('error while deleting the user', err);
                        res.json({
                            error: 'There was an error deleting the user'
                        });
                    });
            })
            .catch(err => {
                res.status(404);
                console.log('error while queryting the user', err);
                res.json({ error: "User doesnt exist" });
            });
    } else {
        res.status(404);
        res.json({ error: "Teacher doesnt exist" })
    };
};


module.exports = {
    userGet,
    userPost,
    userPatch,
    userDelete
};

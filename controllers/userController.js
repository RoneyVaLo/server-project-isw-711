const bcrypt = require('bcryptjs');
const User = require("../models/userModel");


const getUserByEmail = (email) => {
    return User.findOne({email});
};

const userGet = async (req, res) => {
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
    } else if (req.body.email) {

        //* Get a user by Email

        const { email } = req.body;
        return User.findOne({ email });

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

        const { first_name, last_name, age, role, email, password, profile_image, verified, phone } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        user.first_name = first_name;
        user.last_name = last_name;
        user.age = age;
        user.role = role ? role : "user";
        user.email = email;
        user.password = hashedPassword;
        user.profile_image = profile_image ? profile_image : "";
        user.verified = verified ? verified : false;
        user.phone = phone;

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
        User.findById(req.query.id).then(async (user) => {

            let hashedPassword = "";
            if ((req.body.password) && (req.body.password !== "")) {
                hashedPassword = await bcrypt.hash(req.body.password, 10);
            } else {
                hashedPassword = user.password;
            }

            user.first_name = req.body.first_name ? req.body.first_name : user.first_name;
            user.last_name = req.body.last_name ? req.body.last_name : user.last_name;
            user.age = req.body.age ? req.body.age : user.age;
            user.role = req.body.role ? req.body.role : user.role;
            user.email = req.body.email ? req.body.email : user.email;
            user.password = hashedPassword;
            user.profile_image = req.body.profile_image ? req.body.profile_image : user.profile_image;
            user.verified = (typeof (req.body.verified) === "boolean") ? req.body.verified : user.verified;
            user.phone = req.body.phone ? req.body.phone : user.phone;

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
        res.json({ error: "User doesnt exist" })
    };
};


const userVerification = (req, res) => {
    if (req.query && req.query.id) {
        User.findById(req.query.id).then(async (user) => {

            if (!user.verified) {
                user.verified = true;

                user.save()
                    .then(() => {
                        res.status(200);
                        res.json({ message: "Verification successfully" });
                    })
                    .catch(err => {
                        res.status(422);
                        console.log('error while verifying the user', err)
                        res.json({
                            error: 'There was an error verifying the user'
                        });
                    });
            } else {
                res.status(200);
                res.json({ message: "Verification successfully" });
            }


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


module.exports = {
    getUserByEmail,
    userGet,
    userPost,
    userPatch,
    userDelete,
    userVerification
};

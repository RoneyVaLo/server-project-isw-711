require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const express = require('express');
const app = express();

//* Database Connection
const mongoose = require("mongoose");
const db = mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const theSecretKey = process.env.JWT_SECRET;

const { userGet, userPost, userPatch, userDelete } = require("./controllers/userController.js");
const { saveSession, getSession } = require("./controllers/sessionController.js");
const { promptPost, promptGet, promptPatch, promptDelete } = require('./controllers/promptController.js');
const { createEdit, createImage, createCompletion } = require('./controllers/openAiController.js');


// Parser for the request body
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Check for Cors
const cors = require("cors");
app.use(cors({
    domains: '*',
    methods: "*"
}));


// login token based
app.post("/api/login", async (req, res) => {
    const user = await userGet(req, res);
    if (user) {
        const { password } = req.body;

        if (password) {
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                if (user.verified) {

                    const token = jwt.sign({
                        userId: user._id,
                        email: user.email,
                        role: user.role,
                        verified: user.verified
                    }, theSecretKey, { expiresIn: "1d" });

                    res.status(201).json({
                        token
                    });

                    return;
                } else {
                    res.status(422);
                    res.json({
                        error: 'User not verified'
                    });
                };
            };
        } else {
            res.status(422);
            res.json({
                error: 'Invalid username or password'
            });
        };
    } else {
        res.status(422);
        res.json({
            error: 'Invalid username or password'
        });
    };

    /* users.then((user) => {
        if (user) {
            if (user.verified) {

                const token = jwt.sign({
                    userId: user._id,
                    email: user.email,
                    role: user.role,
                    verified: user.verified
                }, theSecretKey, { expiresIn: "1d" });

                // console.log(token)
                res.status(201).json({
                    token
                });

                return;
            } else {
                res.status(422);
                res.json({
                    error: 'User not verified'
                });
            };
        } else {
            res.status(422);
            res.json({
                error: 'Invalid username or password'
            });
        };
    }); */
});

app.post("/api/user/register", userPost);


app.use(async (req, res, next) => {

    if (req.headers["authorization"]) {
        const token = req.headers['authorization'].split(' ')[1];
        try {
            jwt.verify(token, theSecretKey, (err, decodedToken) => {
                if (err || !decodedToken) {
                    res.status(401);
                    res.json({
                        error: "Unauthorized"
                    });
                };
                next();
            });
        } catch (e) {
            res.status(422);
            res.send({
                error: "There was an error: " + e.message
            });
        }
    } else {
        res.status(401);
        res.send({
            error: "Unauthorized "
        });
    }
});

app.get("/api/session", async (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    try {
        const sessions = await getSession(token);
        res.status(200);
        res.send(sessions[0]);
    } catch (err) {
        res.status(404);
        console.log('error while queryting the session', err);
        res.json({ error: "Session doesnt exist" });
    }
});


// Management for users

//? This is to get an user by email
app.post("/api/users", async (req, res) => {
    let user = await userGet(req, res);
    res.json(user);
});
app.get("/api/users", userGet);
app.patch("/api/users", userPatch);
app.put("/api/users", userPatch);
app.delete("/api/users", userDelete);

// Management for prompts
app.post("/api/prompts", promptPost);
app.get("/api/prompts", promptGet);
app.patch("/api/prompts", promptPatch);
app.put("/api/prompts", promptPatch);
app.delete("/api/prompts", promptDelete);

app.post("/api/image", createImage);
app.post("/api/edit", createEdit);
app.post("/api/completion", createCompletion);



app.listen(3001, () => console.log(`Server listening on port 3001!`));

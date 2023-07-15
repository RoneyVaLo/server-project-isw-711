require('dotenv').config();
const express = require('express');
const app = express();

//* Database Connection
const mongoose = require("mongoose");
const db = mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useFindAndModify: false,
});

const { userGet, userPost, userPatch, userDelete } = require("./controllers/userController.js");
const { saveSession, getSession } = require("./controllers/sessionController.js");


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
app.post("/api/login", async (req, res, next) => {
    const users = userGet(req, res);

    users.then((user) => {
        if (user) {
            if (user.verified) {
                const session = saveSession(user);

                session.then((session) => {
                    res.status(201).json({
                        session
                    });
                }).catch(err => {
                    res.status(422);
                    res.json({
                        error: 'There was an error saving the session'
                    });
                })
                    ;
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
    });
});

app.post("/api/users", userPost);


app.use(async (req, res, next) => {

    if (req.headers["authorization"]) {
        const token = req.headers['authorization'].split(' ')[1];
        try {
            // Validate if token exists in the database
            const sessions = await getSession(token);

            // Validate that the sessions are not expired
            const sessionsNotExpired = sessions.filter(session => session.expire > (new Date().getDate()));

            if (sessionsNotExpired.length > 0) {
                next();
                return;
            } else {
                res.status(401);
                res.send({
                    error: "Unauthorized "
                });
            }
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
app.get("/api/users", userGet);
app.patch("/api/users", userPatch);
app.put("/api/users", userPatch);
app.delete("/api/users", userDelete);

app.listen(3001, () => console.log(`Server listening on port 3001!`));

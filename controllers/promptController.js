const Prompt = require('../models/promptModel');

const promptPost = async (req, res) => {
    let prompt = new Prompt();

    try {
        prompt.user = req.body.user;
        prompt.name = req.body.name;
        prompt.type = req.body.type;
        prompt.data = req.body.data;
        prompt.tags = req.body.tags;

        await prompt.save()
            .then(data => {
                res.status(201);
                res.header({
                    'location': `/api/propmts/?id=${data.id}`
                });
                res.json(data);
            })
            .catch(err => {
                res.status(422);
                console.log('error while saving the prompt', err);
                res.json({
                    error: 'There was an error saving the prompt'
                });
            });
    } catch (err) {
        console.log(err);
        res.status(422);
        console.log('error while saving the prompt')
        res.json({
            error: 'No valid data provided for prompt'
        });
    };
};


const promptGet = (req, res) => {
    if (req.query && req.query.id) {

        //* Get a prompt by id

        Prompt.findById(req.query.id)
            .then((prompt) => {
                res.json(prompt);
            })
            .catch(err => {
                res.status(404);
                console.log('error while queryting the prompt', err)
                res.json({ error: "Prompt doesnt exist" })
            });
    } else {

        //* Get all existing users in the database

        Prompt.find()
            .then(prompts => {
                res.json(prompts);
            })
            .catch(err => {
                res.status(422);
                res.json({ "error": err });
            });
    }
};

module.exports = {
    promptPost,
    promptGet
}

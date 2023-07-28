const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
});

/**
 * Executes prompt
 *
 * @param {*} req
 * @param {*} res
 */
const executePrompt = async (req, res) => {
    const openai = new OpenAIApi(configuration);
    const response = await openai.listModels();

    res.status(200); // CREATED

    res.json(response);

};


const createEdit = async (req, res) => {
    const { OpenAIApi } = require("openai");
    const openai = new OpenAIApi(configuration);
    const { data } = req.body;

    if (data) {
        const response = await openai.createEdit(data);
        if (response) {
            res.status(201); // CREATED
            res.json(response.data);
        } else {
            res.status(422);
            res.json({
                message: "There was an error executing the open AI method"
            });
        };
    }
};

const createImage = async (req, res) => {
    const { OpenAIApi } = require("openai");
    const openai = new OpenAIApi(configuration);
    const { data } = req.body;

    if (data) {
        const response = await openai.createImage(data);
        if (response) {
            res.status(201); // CREATED
            res.json(response.data);
        } else {
            res.status(422);
            res.json({
                message: "There was an error executing the open AI method"
            });
        };
    } else {
        res.status(422);
        res.json({
            message: "There was an error executing the open AI method"
        });
    };
};

const createCompletion = async (req, res) => {
    const { OpenAIApi } = require("openai");
    const openai = new OpenAIApi(configuration);
    const { data } = req.body;
    if (data) {
        const response = await openai.createCompletion(data);
        if (response) {
            res.status(201); // CREATED
            res.json(response.data);
        } else {
            res.status(422);
            res.json({
                message: "There was an error executing the open AI method"
            });
        };
    } else {
        res.status(422);
        res.json({
            message: "There was an error executing the open AI method"
        });
    };
};


module.exports = {
    executePrompt,
    createEdit,
    createImage,
    createCompletion
}

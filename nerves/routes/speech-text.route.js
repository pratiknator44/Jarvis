const express = require('express');
const multer = require('multer');
const { AssemblyAI } = require('assemblyai');
const path = require('path');
const { Constants } = require('../constants');
const { default: axios } = require('axios');
const { default: getVoiceForText } = require('../controllers/elevanlabs.controller');
const route = express.Router();
const fs = require('fs').promises; // Use promises for async/await
const { Readable } = require('stream'); // only works in Node 18+
const { LMRequest } = require('../services/utils');
const { taskDeligator } = require('../services/tasks/tasjkList');

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        try {
            const uploadPath = 'uploads/';
            await fs.mkdir(uploadPath, { recursive: true }); // Ensure directory exists
            cb(null, uploadPath);
        } catch (err) {
            cb(err);
        }
    },

    filename: async function (req, file, cb) {
        try {
            const ext = path.extname(file.originalname) || '.mp3';
            const fileName = `audio-${Date.now()}${ext}`;
            cb(null, fileName);
        } catch (err) {
            cb(err);
        }
    }
});

route.post('/transcribe', async (req, res) => {
    console.log('Query:', req.body);
    const query = req.body.sentence;

    try {
        const response = await axios.post(
            Constants.MODEL_URL,
            {
                model: 'gemma-3-4b-it-qat',
                stream: false,
                messages: [
                    { role: 'system', content: "You are a helpful assistant and you are called 'Jarvis' and you address me as 'sir', your creator. And you're trying your best to be my sidekick" },
                    { role: 'user', content: query }
                ],
                temperature: 0.7,
                max_tokens: 300,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        res.json({ reply: response.data.choices[0].message.content });


    } catch (err) {
        console.error('Server Error:', err);
        res.status(500).send('Something went wrong');
    }
});



route.post('/transcribe-stream', async (req, res) => {
    const query = req.body.sentence;
    let response;
    try {
        let taskOrChatdecision = 'chat';
        console.log('decision Query:', query);
        try {
            const response = await LMRequest(query);
            taskOrChatdecision = response.data.choices[0].message.content;
        } catch (error) {
            console.error('Error occurred while making LMRequest:', error.message);
        }
        console.log("to json", JSON.parse(taskOrChatdecision));
        const r = JSON.parse(taskOrChatdecision);
        if (r.response === "Task") {
            const result = taskDeligator(r);
            console.log('Task Result:', result);
            response = {
                data: Readable.from([
                    `data: ${JSON.stringify({ choices: [{ delta: { content: result } }] })}\n\n`,
                    `data: [DONE]\n\n`
                ])
            };
        }
        else if (r.response === "Shutdown") {
            console.log("Shutting down the server...");
            res.json({ reply: "Shutting down the server... Goodbye World" });
            process.exit(0); // This will stop the Node.js process
        }
        else if (r.response === "Chat") {

            response = await axios({
                method: 'post',
                url: Constants.MODEL_URL,
                data: {
                    model: Constants.MODEL_GEMMA3,
                    url: 'http://localhost:1234/v1/chat/completions', // adjust as per LM Studio's port
                    stream: true,
                    messages: [
                        {
                            role: 'system',
                            content: "You're a helpful AI assistant"
                        },
                        { role: 'user', content: query }
                    ],
                    temperature: 0.5,
                    max_tokens: 200
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                responseType: 'stream' // 👈 This is the magic
            });
        }

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');


        response.data.on('data', (chunk) => {
            res.write(`data: ${chunk.toString()}\n\n`);
        });

        response.data.on('end', () => {
            res.write('data: [DONE]\n\n');
            res.end();
        });

    } catch (err) {
        console.error('Streaming Error:', err.message);
        res.status(500).send('Streaming failed');
    }
});


module.exports = route;
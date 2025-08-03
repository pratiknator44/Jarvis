const route = require('express').Router();
const axios = require('axios');
const { Constants } = require('../constants');

route.post('/', async (req, res) => {
    try {

        console.log("got request ping");
        const response = await axios.post(
            Constants.MODEL_URL,
            {
                model: 'llama-3.2-1b-instruct',
                stream: true,
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: req.body.message }
                ],
                temperature: 0.7,
                max_tokens: 300,
            },
            {
                responseType: 'stream',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        res.setHeader('Content-Type', 'text/plain'); // or 'text/event-stream' if using SSE
        res.setHeader('Transfer-Encoding', 'chunked');

        response.data.on('data', (chunk) => {
            const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
                if (line.startsWith('data:')) {
                    const jsonStr = line.replace(/^data:\s*/, '');
                    if (jsonStr === '[DONE]') {
                        res.end();
                        return;
                    }

                    try {
                        const parsed = JSON.parse(jsonStr);
                        const delta = parsed.choices?.[0]?.delta?.content;
                        if (delta) res.write(delta);
                    } catch (err) {
                        console.error('Error parsing chunk:', err);
                    }
                }
            }
        });

        response.data.on('end', () => {
            res.end(); // Close the stream
        });

        response.data.on('error', (err) => {
            console.error('Stream error:', err);
            res.end();
        });

    } catch (error) {
        console.error('Error making request:', error.message);
        return res.status(500).send('Error making request to the model');
    }
});

module.exports = route;

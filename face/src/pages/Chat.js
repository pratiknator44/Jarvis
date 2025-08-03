import React, { useEffect, useState } from 'react';
import { sendSimpleChatQuery } from '../services/api';

const Chat = ({ query }) => {
    const [input, setInput] = useState('');
    const [responseText, setResponseText] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        if (query) {
            setInput(query);
            handleSubmit();
        }
    }, [query])

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            setResponseText('');

            const res = await sendSimpleChatQuery(input);

            if (!res.body) {
                console.error('No stream received');
                setIsLoading(false);
                return;
            }

            console.log("started gettin response stream");
            const reader = res.body.getReader();
            const decoder = new TextDecoder('utf-8');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                setResponseText(prev => prev + chunk);
            }
        } catch (e) {
            console.error('Error:', e);
            setResponseText('Error: ' + e.message);
        } finally {

            setIsLoading(false);
        }
    };

    return (
        <div className="p-4">
            <textarea
                rows={4}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="w-full p-2 border rounded"
            />
            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
                {isLoading ? 'Sending...' : 'Send'}
            </button>

            <div className="mt-4 p-4 bg-gray-100 rounded whitespace-pre-wrap font-mono">
                response: {responseText}
            </div>
        </div>
    );
};

export default Chat;

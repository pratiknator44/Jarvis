export function tryParseChunk(chunk) {
    try {
        // Trim and isolate the part after 'data: '
        const clean = chunk.trim().replace(/^data:\s*/, "");

        // Handle '[DONE]' or keep parsing
        if (clean === "[DONE]") return null;

        return JSON.parse(clean);
    } catch (err) {
        console.warn("Failed to parse chunk:", chunk);
        return null;
    }
}

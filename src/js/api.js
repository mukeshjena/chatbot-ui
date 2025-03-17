/**
 * API communication functions for the chatbot widget
 */

/**
 * Sends a message to the chatbot API
 * @param {string} apiUrl - The API URL
 * @param {string} message - The user message
 * @param {Array} conversationHistory - Previous messages in the conversation
 * @returns {Promise<Object>} The API response
 */
export async function sendMessage(apiUrl, message, conversationHistory = []) {
    try {
        const response = await fetch(`${apiUrl}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                conversationHistory
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error (${response.status}): ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error sending message to API:', error);
        throw error;
    }
}

/**
 * Checks if the API is available
 * @param {string} apiUrl - The API URL
 * @returns {Promise<boolean>} Whether the API is available
 */
export async function checkApiAvailability(apiUrl) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${apiUrl}/api/chat/health`, {
            method: 'GET',
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        return response.ok;
    } catch (error) {
        console.error('API availability check failed:', error);
        return false;
    }
}

import '../css/chatbot.css';
import { ChatbotUI } from './ui';
import { sendMessage, checkApiAvailability } from './api';

/**
 * Chatbot Widget main class
 */
class ChatbotWidget {
    /**
     * Creates a new ChatbotWidget instance
     * @param {Object} config - Configuration options
     */
    constructor() {
        this.config = {
            apiUrl: '',
            botName: 'AI Assistant',
            primaryColor: '#5c6bc0',
            welcomeMessage: 'Hi there! How can I help you today?',
            placeholderText: 'Type a message...',
            position: 'right', // 'right' or 'left'
        };

        this.ui = null;
        this.conversationHistory = [];
        this.isInitialized = false;
    }

    /**
     * Initializes the chatbot widget
     * @param {Object} config - Configuration options
     */
    init(config = {}) {
        // Prevent multiple initializations
        if (this.isInitialized) {
            console.warn('ChatbotWidget is already initialized');
            return;
        }

        // Merge config with defaults
        this.config = { ...this.config, ...config };

        // Validate required config
        if (!this.config.apiUrl) {
            console.error('ChatbotWidget: apiUrl is required');
            return;
        }

        // Initialize UI
        this.ui = new ChatbotUI({
            botName: this.config.botName,
            primaryColor: this.config.primaryColor,
            position: this.config.position,
        });

        // Initialize UI elements
        const elements = this.ui.init();

        // Register event handlers
        this.ui.on('sendMessage', (message) => this.handleUserMessage(message));
        this.ui.on('open', () => this.handleChatOpen());

        // Set placeholder text
        elements.inputContainer.querySelector('.chatbot-input').placeholder = this.config.placeholderText;

        // Mark as initialized
        this.isInitialized = true;

        // Check API availability
        this.checkApiStatus();

        return this;
    }

    /**
     * Handles when a user sends a message
     * @param {string} message - The user message
     */
    async handleUserMessage(message) {
        // Add user message to UI
        this.ui.addMessage(message, 'user');

        // Add to conversation history
        this.conversationHistory.push({
            role: 'user',
            content: message
        });

        // Show typing indicator
        this.ui.showTypingIndicator();

        try {
            // Send message to API
            const response = await sendMessage(
                this.config.apiUrl,
                message,
                this.conversationHistory
            );

            // Hide typing indicator
            this.ui.hideTypingIndicator();

            if (response.success) {
                // Add bot response to UI
                this.ui.addMessage(response.message, 'bot');

                // Add to conversation history
                this.conversationHistory.push({
                    role: 'assistant',
                    content: response.message
                });

                // Limit conversation history length (to prevent very long contexts)
                if (this.conversationHistory.length > 20) {
                    // Keep the first message (usually system prompt) and the last 19 messages
                    const firstMessage = this.conversationHistory[0];
                    this.conversationHistory = [
                        firstMessage,
                        ...this.conversationHistory.slice(-19)
                    ];
                }
            } else {
                // Show error message
                this.ui.addMessage('Sorry, I encountered an error. Please try again later.', 'bot');
                console.error('API error:', response.error);
            }
        } catch (error) {
            // Hide typing indicator
            this.ui.hideTypingIndicator();

            // Show error message
            this.ui.addMessage('Sorry, I\'m having trouble connecting to my brain right now. Please try again later.', 'bot');
            console.error('Error sending message:', error);
        }
    }

    /**
     * Handles when the chat is opened
     */
    handleChatOpen() {
        // Check API status when chat is opened
        this.checkApiStatus();
    }

    /**
     * Checks if the API is available
     */
    async checkApiStatus() {
        try {
            const isAvailable = await checkApiAvailability(this.config.apiUrl);

            if (!isAvailable && this.isInitialized) {
                console.warn('ChatbotWidget: API is not available');
            }
        } catch (error) {
            console.error('Error checking API status:', error);
        }
    }

    /**
     * Opens the chat window
     */
    open() {
        if (this.ui && !this.ui.isOpen) {
            this.ui.toggleChat();
        }
    }

    /**
     * Closes the chat window
     */
    close() {
        if (this.ui && this.ui.isOpen) {
            this.ui.toggleChat();
        }
    }

    /**
     * Clears the conversation history
     */
    clearConversation() {
        this.conversationHistory = [];

        if (this.ui) {
            // Clear messages in UI
            const messagesContainer = this.ui.elements.messages;
            messagesContainer.innerHTML = '';

            // Add welcome message
            this.ui.addWelcomeMessage();
        }
    }
}

// Create and export a singleton instance
const chatbotWidget = new ChatbotWidget();
export default chatbotWidget;

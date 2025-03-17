import { createElement, formatTime, scrollToBottom } from './utils';

// Define SVG icons inline
const chatIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
</svg>`;

const closeIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="18" y1="6" x2="6" y2="18"></line>
  <line x1="6" y1="6" x2="18" y2="18"></line>
</svg>`;

const sendIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="22" y1="2" x2="11" y2="13"></line>
  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
</svg>`;

const optionsIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="1"></circle>
  <circle cx="12" cy="5" r="1"></circle>
  <circle cx="12" cy="19" r="1"></circle>
</svg>`;

/**
 * UI module for the chatbot widget
 */
export class ChatbotUI {
    constructor(config) {
        this.config = {
            botName: 'AI Assistant',
            primaryColor: '#5c6bc0',
            ...config
        };

        this.isOpen = false;
        this.elements = {};
        this.eventHandlers = {};
    }

    /**
     * Initializes the UI
     * @returns {Object} The created UI elements
     */
    init() {
        // Create main container
        this.elements.container = createElement('div', { className: 'chatbot-widget' });

        // Create toggle button
        this.elements.toggleBtn = createElement('button', {
            className: 'chatbot-toggle-btn',
            ariaLabel: 'Toggle chatbot',
            innerHTML: chatIconSvg,
            onClick: () => this.toggleChat()
        });

        // Create chat window
        this.elements.window = createElement('div', { className: 'chatbot-window' });

        // Create header
        this.elements.header = createElement('div', { className: 'chatbot-header' }, [
            createElement('div', { className: 'chatbot-title' }, this.config.botName),
            createElement('button', {
                className: 'chatbot-options-btn',
                ariaLabel: 'Chatbot options',
                innerHTML: optionsIconSvg
            })
        ]);

        // Create messages container
        this.elements.messages = createElement('div', { className: 'chatbot-messages' });

        // Create input container
        this.elements.inputContainer = createElement('div', { className: 'chatbot-input-container' }, [
            createElement('textarea', {
                className: 'chatbot-input',
                placeholder: 'Type a message...',
                rows: 1,
                onKeydown: (e) => this.handleInputKeydown(e)
            }),
            createElement('button', {
                className: 'chatbot-send-btn',
                ariaLabel: 'Send message',
                innerHTML: sendIconSvg,
                onClick: () => this.handleSendClick()
            })
        ]);

        // Assemble the chat window
        this.elements.window.appendChild(this.elements.header);
        this.elements.window.appendChild(this.elements.messages);
        this.elements.window.appendChild(this.elements.inputContainer);

        // Add welcome message
        this.addWelcomeMessage();

        // Append elements to the container
        this.elements.container.appendChild(this.elements.toggleBtn);
        this.elements.container.appendChild(this.elements.window);

        // Apply custom styles
        this.applyCustomStyles();

        // Append container to the body
        document.body.appendChild(this.elements.container);

        return this.elements;
    }

    /**
     * Applies custom styles based on config
     */
    applyCustomStyles() {
        if (this.config.primaryColor) {
            const style = document.createElement('style');
            style.textContent = `
        :root {
          --chatbot-primary-color: ${this.config.primaryColor};
          --chatbot-primary-dark: ${this.darkenColor(this.config.primaryColor, 20)};
          --chatbot-primary-light: ${this.lightenColor(this.config.primaryColor, 20)};
        }
      `;
            document.head.appendChild(style);
        }
    }

    /**
     * Toggles the chat window open/closed
     */
    toggleChat() {
        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            this.elements.window.classList.add('active');
            this.elements.toggleBtn.innerHTML = closeIconSvg;
            this.elements.toggleBtn.setAttribute('aria-expanded', 'true');

            // Focus the input field
            setTimeout(() => {
                this.elements.inputContainer.querySelector('.chatbot-input').focus();
            }, 300);

            // Trigger onOpen event
            if (this.eventHandlers.onOpen) {
                this.eventHandlers.onOpen();
            }
        } else {
            this.elements.window.classList.remove('active');
            this.elements.toggleBtn.innerHTML = chatIconSvg;
            this.elements.toggleBtn.setAttribute('aria-expanded', 'false');

            // Trigger onClose event
            if (this.eventHandlers.onClose) {
                this.eventHandlers.onClose();
            }
        }
    }

    /**
     * Adds a welcome message
     */
    addWelcomeMessage() {
        const welcomeMessage = createElement('div', {
            className: 'chatbot-message bot'
        }, `Hi there! I'm ${this.config.botName}. How can I help you today?`);

        this.elements.messages.appendChild(welcomeMessage);
    }

    /**
     * Adds a message to the chat
     * @param {string} text - The message text
     * @param {string} sender - The message sender ('bot' or 'user')
     */
    addMessage(text, sender = 'bot') {
        const message = createElement('div', {
            className: `chatbot-message ${sender}`
        }, [
            text,
            createElement('div', {
                className: 'chatbot-message-time'
            }, formatTime(new Date()))
        ]);

        this.elements.messages.appendChild(message);
        scrollToBottom(this.elements.messages);

        return message;
    }

    /**
     * Shows the typing indicator
     */
    showTypingIndicator() {
        // Remove existing typing indicator if any
        this.hideTypingIndicator();

        const typingIndicator = createElement('div', { className: 'chatbot-typing' }, [
            createElement('div', { className: 'chatbot-typing-dot' }),
            createElement('div', { className: 'chatbot-typing-dot' }),
            createElement('div', { className: 'chatbot-typing-dot' })
        ]);

        this.elements.typingIndicator = typingIndicator;
        this.elements.messages.appendChild(typingIndicator);
        scrollToBottom(this.elements.messages);
    }

    /**
     * Hides the typing indicator
     */
    hideTypingIndicator() {
        if (this.elements.typingIndicator) {
            this.elements.typingIndicator.remove();
            this.elements.typingIndicator = null;
        }
    }

    /**
     * Handles the send button click
     */
    handleSendClick() {
        const input = this.elements.inputContainer.querySelector('.chatbot-input');
        const message = input.value.trim();

        if (message) {
            // Trigger onSendMessage event
            if (this.eventHandlers.onSendMessage) {
                this.eventHandlers.onSendMessage(message);
            }

            // Clear input
            input.value = '';
            input.style.height = 'auto';
            input.focus();
        }
    }

    /**
     * Handles keydown events in the input field
     * @param {Event} event - The keydown event
     */
    handleInputKeydown(event) {
        const input = event.target;

        // Auto-resize textarea
        setTimeout(() => {
            input.style.height = 'auto';
            input.style.height = Math.min(input.scrollHeight, 100) + 'px';
        }, 0);

        // Send message on Enter (without Shift)
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.handleSendClick();
        }
    }

    /**
     * Registers an event handler
     * @param {string} event - The event name
     * @param {Function} handler - The event handler
     */
    on(event, handler) {
        this.eventHandlers[`on${event.charAt(0).toUpperCase() + event.slice(1)}`] = handler;
    }

    /**
     * Lightens a color by a percentage
     * @param {string} color - The color to lighten
     * @param {number} percent - The percentage to lighten by
     * @returns {string} The lightened color
     */
    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;

        return '#' + (
            0x1000000 +
            (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)
        ).toString(16).slice(1);
    }

    /**
     * Darkens a color by a percentage
     * @param {string} color - The color to darken
     * @param {number} percent - The percentage to darken by
     * @returns {string} The darkened color
     */
    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;

        return '#' + (
            0x1000000 +
            (R > 0 ? R : 0) * 0x10000 +
            (G > 0 ? G : 0) * 0x100 +
            (B > 0 ? B : 0)
        ).toString(16).slice(1);
    }
}

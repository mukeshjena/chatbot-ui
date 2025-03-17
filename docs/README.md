# Chatbot Widget Documentation

## Overview

The Chatbot Widget is a lightweight, customizable chat interface that can be easily integrated into any website. It provides a modern, responsive UI for users to interact with an AI-powered chatbot.

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Configuration Options](#configuration-options)
- [API Reference](#api-reference)
- [Styling](#styling)
- [Browser Compatibility](#browser-compatibility)
- [Troubleshooting](#troubleshooting)
- [Examples](#examples)

## Installation

### Direct Script Include

The simplest way to add the chatbot widget to your website is by including the script directly:

```html
<script src="https://your-cdn-path/chatbot-widget.min.js"></script>
<script>
  ChatbotWidget.init({
    apiUrl: 'https://your-api-url.com'
  });
</script>
```

### NPM Installation

If you're using a module bundler like webpack:

```bash
npm install chatbot-widget
```

Then import and use it in your code:

```javascript
import ChatbotWidget from 'chatbot-widget';

ChatbotWidget.init({
  apiUrl: 'https://your-api-url.com'
});
```

## Basic Usage

The widget requires minimal setup to get started. The only required configuration is the `apiUrl` parameter:

```javascript
ChatbotWidget.init({
  apiUrl: 'https://your-api-url.com'
});
```

This will add a chat button to the bottom right corner of your website. When clicked, it will open a chat interface where users can interact with your AI assistant.

## Configuration Options

The `init()` method accepts a configuration object with the following options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiUrl` | String | `''` | **Required**. The URL of your chatbot API endpoint. |
| `botName` | String | `'AI Assistant'` | The name displayed in the chat header. |
| `primaryColor` | String | `'#5c6bc0'` | The primary color used for the widget theme. |
| `welcomeMessage` | String | `'Hi there! How can I help you today?'` | The initial message displayed when the chat is opened. |
| `placeholderText` | String | `'Type a message...'` | The placeholder text for the input field. |
| `position` | String | `'right'` | Position of the widget. Can be `'right'` or `'left'`. |

Example with all options:

```javascript
ChatbotWidget.init({
  apiUrl: 'https://your-api-url.com',
  botName: 'Support Bot',
  primaryColor: '#4CAF50',
  welcomeMessage: 'Hello! I\'m your support assistant. How can I help you today?',
  placeholderText: 'Ask me anything...',
  position: 'left'
});
```

## API Reference

The ChatbotWidget exposes the following methods:

### `init(config)`

Initializes the chatbot widget with the provided configuration.

```javascript
ChatbotWidget.init({
  apiUrl: 'https://your-api-url.com'
});
```

### `open()`

Programmatically opens the chat window.

```javascript
ChatbotWidget.open();
```

### `close()`

Programmatically closes the chat window.

```javascript
ChatbotWidget.close();
```

### `clearConversation()`

Clears the current conversation history and resets the chat.

```javascript
ChatbotWidget.clearConversation();
```

## Styling

The widget is designed to be minimally intrusive and should work well with most website designs. It uses a shadow DOM to encapsulate its styles and prevent conflicts with your website's CSS.

If you need to customize the appearance beyond the `primaryColor` option, you can add custom CSS to target the widget elements:

```css
/* Example: Change the size of the toggle button */
.chatbot-toggle-btn {
  width: 60px !important;
  height: 60px !important;
}
```

## Browser Compatibility

The Chatbot Widget is compatible with all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

Internet Explorer is not supported.

## Troubleshooting

### The widget isn't appearing on my site

- Make sure the script is properly loaded
- Check the browser console for any errors
- Verify that the `apiUrl` is correct and accessible

### The chat isn't connecting to my API

- Ensure your API endpoint is correctly configured and running
- Check for CORS issues if your API is on a different domain
- Verify the API response format matches what the widget expects

### The widget styling conflicts with my website

- The widget uses a shadow DOM to isolate its styles
- If conflicts persist, try adjusting the z-index of conflicting elements

## Examples

Check out the samples directory for complete examples:

- [Basic Integration](../samples/basic-integration.html) - Simple implementation
- [Advanced Integration](../samples/advanced-integration.html) - With custom styling and programmatic control
- [Website Example](../samples/website-example.html) - Integration in a real-world website context

## API Requirements

Your API endpoint should accept POST requests to `/api/chat` with the following JSON structure:

```json
{
  "message": "User's message here",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Previous user message"
    },
    {
      "role": "assistant",
      "content": "Previous bot response"
    }
  ]
}
```

And should return a response with:

```json
{
  "success": true,
  "message": "Bot's response message"
}
```

For health checks, the widget will make a GET request to `/api/chat/health`.

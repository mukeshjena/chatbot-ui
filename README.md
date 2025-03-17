# Chatbot Widget

A lightweight, customizable chatbot widget that can be easily embedded into any website. This widget provides a modern chat interface for AI-powered conversations.

![Chatbot Widget Screenshot](https://via.placeholder.com/600x400?text=Chatbot+Widget+Screenshot)

## Features

- 💬 Clean, modern chat interface
- 🎨 Customizable colors and appearance
- 📱 Fully responsive design (mobile-friendly)
- ⚡ Lightweight with minimal dependencies
- 🔌 Easy integration with any backend
- 🔒 Privacy-focused (no third-party tracking)

## Quick Start

### 1. Include the CSS and JavaScript

Add the following to your HTML:

```html
<!-- In the <head> section -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/yourusername/chatbot-widget@main/dist/chatbot-widget.min.css"
/>

<!-- At the end of the <body> section -->
<script src="https://cdn.jsdelivr.net/gh/yourusername/chatbot-widget@main/dist/chatbot-widget.min.js"></script>
```

### 2. Initialize the Widget

```html
<script>
  // Initialize the chatbot
  const chatbot = new ChatbotWidget({
    botName: "AI Assistant",
    primaryColor: "#5c6bc0",
  });

  // Handle sending messages
  chatbot.on("sendMessage", (message) => {
    // Add user message to the chat
    chatbot.addUserMessage(message);

    // Show typing indicator
    chatbot.showTypingIndicator();

    // Make API call to your backend
    fetch("https://your-api-endpoint.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Hide typing indicator
        chatbot.hideTypingIndicator();

        // Add bot response
        chatbot.addBotMessage(data.response);
      })
      .catch((error) => {
        chatbot.hideTypingIndicator();
        chatbot.addBotMessage(
          "Sorry, I encountered an error. Please try again later."
        );
        console.error("Error:", error);
      });
  });
</script>
```

## Configuration Options

The widget can be customized with the following options:

```javascript
const chatbot = new ChatbotWidget({
  // Basic settings
  botName: "AI Assistant", // Name displayed in the chat header
  primaryColor: "#5c6bc0", // Primary color for the widget

  // Advanced settings
  position: "right", // 'right' or 'left' side of the screen
  initialMessage: "Hello! How can I help you today?", // First message shown
  placeholder: "Type a message...", // Input placeholder text
});
```

## API Reference

### Methods

| Method                  | Description                         |
| ----------------------- | ----------------------------------- |
| `addUserMessage(text)`  | Adds a user message to the chat     |
| `addBotMessage(text)`   | Adds a bot message to the chat      |
| `showTypingIndicator()` | Shows the typing indicator          |
| `hideTypingIndicator()` | Hides the typing indicator          |
| `toggleChat()`          | Toggles the chat window open/closed |
| `on(event, callback)`   | Registers an event handler          |

### Events

| Event         | Description                              |
| ------------- | ---------------------------------------- |
| `sendMessage` | Triggered when the user sends a message  |
| `open`        | Triggered when the chat window is opened |
| `close`       | Triggered when the chat window is closed |

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/chatbot-widget.git
   cd chatbot-widget
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

### Project Structure

```
chatbot-widget/
├── dist/                  # Built files (generated)
├── src/
│   ├── js/
│   │   ├── chatbot.js     # Main entry point
│   │   ├── ui.js          # UI components
│   │   └── utils.js       # Utility functions
│   └── css/
│       └── styles.css     # Styles for the widget
├── webpack.config.js      # Webpack configuration
└── package.json           # Project dependencies
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

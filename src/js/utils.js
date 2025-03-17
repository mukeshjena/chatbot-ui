/**
 * Utility functions for the chatbot widget
 */

/**
 * Creates an HTML element with the given attributes and children
 * @param {string} tag - The HTML tag name
 * @param {Object} attributes - Key-value pairs of attributes
 * @param {Array|string|HTMLElement} children - Child elements or text content
 * @returns {HTMLElement} The created element
 */
export function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);

    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'innerHTML') {
            element.innerHTML = value;
        } else if (key === 'style' && typeof value === 'object') {
            Object.assign(element.style, value);
        } else if (key.startsWith('on') && typeof value === 'function') {
            const eventName = key.substring(2).toLowerCase();
            element.addEventListener(eventName, value);
        } else {
            element.setAttribute(key, value);
        }
    });

    // Add children
    if (Array.isArray(children)) {
        children.forEach(child => {
            if (child) {
                appendChild(element, child);
            }
        });
    } else if (children) {
        appendChild(element, children);
    }

    return element;
}

/**
 * Appends a child to an element
 * @param {HTMLElement} parent - The parent element
 * @param {HTMLElement|string} child - The child element or text
 */
function appendChild(parent, child) {
    if (typeof child === 'string' || typeof child === 'number') {
        parent.appendChild(document.createTextNode(child));
    } else if (child instanceof HTMLElement) {
        parent.appendChild(child);
    }
}

/**
 * Formats a date to a readable time string (HH:MM)
 * @param {Date} date - The date to format
 * @returns {string} Formatted time string
 */
export function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Safely parses JSON with error handling
 * @param {string} str - JSON string to parse
 * @param {*} fallback - Fallback value if parsing fails
 * @returns {*} Parsed object or fallback value
 */
export function safeJsonParse(str, fallback = {}) {
    try {
        return JSON.parse(str);
    } catch (e) {
        console.error('Error parsing JSON:', e);
        return fallback;
    }
}

/**
 * Debounces a function call
 * @param {Function} func - The function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Generates a unique ID
 * @returns {string} Unique ID
 */
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Scrolls an element to the bottom
 * @param {HTMLElement} element - The element to scroll
 * @param {boolean} smooth - Whether to use smooth scrolling
 */
export function scrollToBottom(element, smooth = true) {
    if (!element) return;

    element.scrollTo({
        top: element.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
    });
}

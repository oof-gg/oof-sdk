"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketManager = void 0;
class WebSocketManager {
    constructor(baseUrl) {
        this.socket = null;
        this.eventHandlers = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.token = '';
        this.url = baseUrl;
    }
    async connect(token, sessionId) {
        this.token = token;
        return new Promise((resolve, reject) => {
            try {
                // Use token as query parameter for authentication
                let _sessionId = '';
                if (sessionId) {
                    console.log(`[SDK] Setting "sessionId" as ${sessionId}`);
                    _sessionId = `/${sessionId}`;
                }
                const url = `${this.url}${_sessionId}?token=${encodeURIComponent(token)}`;
                this.socket = new WebSocket(url);
                this.socket.onopen = () => {
                    console.log('[SDK] WebSocket connection established');
                    this.reconnectAttempts = 0;
                    resolve();
                };
                this.socket.onmessage = (event) => {
                    try {
                        const message = JSON.parse(event.data);
                        this.handleMessage(message);
                    }
                    catch (e) {
                        console.error('[SDK] Error parsing WebSocket message:', e);
                    }
                };
                this.socket.onerror = (error) => {
                    console.error('[SDK] WebSocket error:', error);
                    reject(error);
                };
                this.socket.onclose = (event) => {
                    console.log(`[SDK] WebSocket closed: ${event.code} ${event.reason}`);
                    // Attempt to reconnect if not a clean close
                    if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
                        this.reconnectAttempts++;
                        const delay = this.reconnectDelay * this.reconnectAttempts;
                        console.log(`[SDK] Attempting to reconnect in ${delay}ms...`);
                        setTimeout(() => {
                            this.connect(this.token, sessionId).catch(e => {
                                console.error('[SDK] Reconnection failed:', e);
                            });
                        }, delay);
                    }
                };
            }
            catch (error) {
                reject(error);
            }
        });
    }
    // Singleton pattern to ensure only one instance of WebSocketManager
    static getInstance(baseUrl) {
        if (!this.instance) {
            this.instance = new WebSocketManager(baseUrl);
        }
        return this.instance;
    }
    subscribeToInstance(instanceId) {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            throw new Error('[SDK] WebSocket is not connected');
        }
        const message = {
            type: 'subscribe',
            instance_id: instanceId
        };
        this.socket.send(JSON.stringify(message));
    }
    sendMessage(message) {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            throw new Error('[SDK] WebSocket is not connected');
        }
        this.socket.send(JSON.stringify(message));
    }
    onEvent(eventType, callback) {
        if (!this.eventHandlers.has(eventType)) {
            this.eventHandlers.set(eventType, []);
        }
        this.eventHandlers.get(eventType)?.push(callback);
    }
    /**
     * Send a custom event to the server
     * @param eventType The type of event to send
     * @param data The data to include with the event
     * @param instanceId Optional instance ID if this event relates to a specific instance
     */
    sendEvent(eventType, data) {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            throw new Error('[SDK] WebSocket is not connected');
        }
        const message = {
            type: eventType,
            data: data
        };
        this.socket.send(JSON.stringify(message));
    }
    handleMessage(message) {
        // Trigger callbacks for this message type
        const handlers = this.eventHandlers.get(message.type) || [];
        for (const handler of handlers) {
            try {
                // send the full message to the handler
                handler(message);
            }
            catch (e) {
                console.error(`[SDK] Error in handler for event type ${message.type}:`, e);
            }
        }
        // Also handle specific message types
        if (message.type === 'error' && message.error) {
            console.error('[SDK] Server error:', message.error);
        }
    }
    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
    isConnected() {
        return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
    }
}
exports.WebSocketManager = WebSocketManager;
WebSocketManager.instance = null;

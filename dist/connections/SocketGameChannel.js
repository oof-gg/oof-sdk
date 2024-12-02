"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketGameChannel = void 0;
class SocketGameChannel {
    constructor(webSocketManager) {
        this.namespace = '/game';
        this.webSocketManager = webSocketManager;
    }
    async connect(token) {
        try {
            await this.webSocketManager.connect(token);
            console.log('Connected to game WebSocket channel.');
        }
        catch (error) {
            console.error('Failed to connect to game WebSocket channel:', error);
            throw error;
        }
    }
    sendEvent(eventType, payload) {
        this.webSocketManager.sendEvent(eventType, payload);
    }
    onEvent(eventType, callback) {
        this.webSocketManager.onEvent(eventType, callback);
    }
    disconnect() {
        this.webSocketManager.disconnect();
    }
}
exports.SocketGameChannel = SocketGameChannel;

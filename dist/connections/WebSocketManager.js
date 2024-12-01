"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketManager = void 0;
const socket_io_client_1 = require("socket.io-client");
class WebSocketManager {
    constructor(url) {
        this.url = url;
        this.socket = (0, socket_io_client_1.io)(this.url);
    }
    async connect(token) {
        this.socket.auth = { token };
        this.socket.connect();
    }
    sendEvent(eventType, payload) {
        this.socket.emit(eventType, payload);
    }
    onEvent(eventType, callback) {
        this.socket.on(eventType, callback);
    }
    disconnect() {
        this.socket.disconnect();
    }
}
exports.WebSocketManager = WebSocketManager;

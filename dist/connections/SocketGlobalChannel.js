"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketGlobalChannel = void 0;
const event_1 = require("@oof.gg/protobuf-ts/dist/global/event");
class SocketGlobalChannel {
    constructor(webSocketManager) {
        this.namespace = '/global';
        this.webSocketManager = webSocketManager;
    }
    subscribeToGlobalEvent(eventType, callback) {
        this.webSocketManager.onEvent(eventType, (data) => {
            const event = event_1.GlobalEvent.decode(data);
            callback(event);
        });
    }
}
exports.SocketGlobalChannel = SocketGlobalChannel;

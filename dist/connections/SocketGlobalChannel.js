"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketGlobalChannel = void 0;
const protobuf_ts_1 = require("@oof.gg/protobuf-ts");
class SocketGlobalChannel {
    constructor(webSocketManager) {
        this.namespace = '/global';
        this.webSocketManager = webSocketManager;
    }
    subscribeToGlobalEvent(eventType, callback) {
        this.webSocketManager.onEvent(eventType, (data) => {
            const event = protobuf_ts_1.global_event.GlobalEvent.decode(data);
            callback(event);
        });
    }
}
exports.SocketGlobalChannel = SocketGlobalChannel;

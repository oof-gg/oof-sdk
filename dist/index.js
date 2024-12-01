"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSDK = void 0;
const SocketGameChannel_1 = require("./connections/SocketGameChannel");
const SocketGlobalChannel_1 = require("./connections/SocketGlobalChannel");
const WebSocketManager_1 = require("./connections/WebSocketManager");
class GameSDK {
    constructor(sdkConfig) {
        this.sdkConfig = sdkConfig;
        this.authenticated = false;
        this.events = {
            local: {
                on: (eventType, callback) => {
                    // Implement local event handling logic here
                },
                emit: (eventType, payload) => {
                    // Implement local event emitting logic here
                }
            },
            websocket: {
                game: {
                    on: (eventType, callback) => {
                        this.gameChannel.onEvent(eventType, callback);
                    },
                    emit: (eventType, payload) => {
                        this.gameChannel.sendEvent(eventType, payload);
                    }
                },
                global: {
                    on: (eventType, callback) => {
                        this.globalChannel.subscribeToGlobalEvent(eventType, callback);
                    }
                }
            }
        };
        this.webSocketManager = new WebSocketManager_1.WebSocketManager(sdkConfig.socketUrl);
        this.gameChannel = new SocketGameChannel_1.SocketGameChannel(this.webSocketManager);
        this.globalChannel = new SocketGlobalChannel_1.SocketGlobalChannel(this.webSocketManager);
    }
    async connect(token) {
        try {
            await this.gameChannel.connect(token);
            this.authenticated = true;
            console.log('GameSDK connected successfully.');
        }
        catch (error) {
            console.error('Failed to connect GameSDK:', error);
            throw error;
        }
    }
    disconnect() {
        this.gameChannel.disconnect();
        this.authenticated = false;
    }
}
exports.GameSDK = GameSDK;

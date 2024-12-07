"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSDK = void 0;
const SocketGameChannel_1 = require("./connections/SocketGameChannel");
const SocketGlobalChannel_1 = require("./connections/SocketGlobalChannel");
const EventDispatcher_1 = require("./events/EventDispatcher");
const WebSocketManager_1 = require("./connections/WebSocketManager");
class GameSDK {
    constructor() {
        this.authenticated = false;
        this.events = {
            local: {
                on: (eventType, callback) => {
                    this.eventDispatcher.subscribe('local', eventType, callback);
                },
                emit: (eventType, payload, context) => {
                    this.eventDispatcher.emitEvent('local', eventType, payload);
                },
                off: (eventType) => {
                    this.eventDispatcher.unsubscribe('local', eventType);
                }
            },
            web: {
                game: {
                    on: (eventType, callback) => {
                        this.gameChannel.onEvent(eventType, (data) => {
                            this.eventDispatcher.emitEvent('websocket.game', eventType, data);
                            callback(data);
                        });
                    },
                    emit: (eventType, payload) => {
                        this.gameChannel.sendEvent(eventType, payload);
                    }
                },
                global: {
                    on: (eventType, callback) => {
                        this.globalChannel.subscribeToGlobalEvent(eventType, (data) => {
                            this.eventDispatcher.emitEvent('websocket.global', eventType, data);
                            callback(data);
                        });
                    }
                }
            },
            log: {
                getEventLog: () => {
                    return this.eventDispatcher.getEventLog();
                }
            }
        };
    }
    init(sdkConfig) {
        this.eventDispatcher = new EventDispatcher_1.EventDispatcher(sdkConfig.workerUrl);
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

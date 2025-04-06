"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSDK = void 0;
const SocketGameChannel_1 = require("./connections/SocketGameChannel");
const EventDispatcher_1 = require("./events/EventDispatcher");
const WebSocketManager_1 = require("./connections/WebSocketManager");
const Game_1 = require("./api/Game");
class GameSDK {
    constructor() {
        this.authenticated = false;
        this.api = {};
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
            },
            log: {
                getEventLog: () => {
                    return this.eventDispatcher.getEventLog();
                }
            }
        };
    }
    init(sdkConfig) {
        this.token = sdkConfig.token || '';
        this.eventDispatcher = new EventDispatcher_1.EventDispatcher(sdkConfig.workerUrl);
        this.webSocketManager = new WebSocketManager_1.WebSocketManager(sdkConfig.socketUrl);
        this.gameChannel = new SocketGameChannel_1.SocketGameChannel(this.webSocketManager);
        this.api.game = new Game_1.default(sdkConfig.apiUrl, this.token);
    }
    async connect(token, sessionId) {
        try {
            await this.gameChannel.connect(token, sessionId);
            this.authenticated = true;
            console.log('[SDK] oof.gg SDK connected successfully.');
        }
        catch (error) {
            console.error('[SDK] Failed to connect GameSDK:', error);
            throw error;
        }
    }
    disconnect() {
        this.gameChannel.disconnect();
        this.authenticated = false;
    }
}
exports.GameSDK = GameSDK;

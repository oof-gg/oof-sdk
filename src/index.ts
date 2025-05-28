import { SocketGameChannel } from './connections/SocketGameChannel';
import { EventDispatcher } from './events/EventDispatcher';
import { WebSocketManager } from './connections/WebSocketManager';
import GameAPI from './api/Game';
import GameInterface from './utils/game';

interface SDKConfig {
    socketUrl: string;
    playerNamespace?: string;
    token?: string;
    globalNamespace?: string;
    apiUrl?: string;
    twitch?: object;
    workerUrl?: string;
}

class GameSDK {
    private webSocketManager: WebSocketManager;
    private gameChannel: SocketGameChannel;
    private authenticated: boolean = false;
    private eventDispatcher: any;
    private token: string;
    public api: any = {};

    public events = {
        local: {
            on: (eventType: any, callback: (data: any) => void) => {
                this.eventDispatcher.subscribe('local', eventType, callback);
            },
            emit: (eventType: any, payload: any, context?: EventTarget) => {
                this.eventDispatcher.emitEvent('local', eventType, payload);
            },
            off: (eventType: any) => {
                this.eventDispatcher.unsubscribe('local', eventType);
            }
        },
        web: {
            game: {
                on: (eventType: string, callback: (data: any) => void) => {
                    this.gameChannel.onEvent(eventType, (data) => {
                        this.eventDispatcher.emitEvent('websocket.game', eventType, data);
                        callback(data);
                    });
                },
                emit: (eventType: string, payload: any) => {
                    console.log('[SDK] Emitting event to game channel:', eventType, payload);
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

    public init(sdkConfig: SDKConfig) {
        this.token = sdkConfig.token || '';
        this.eventDispatcher = new EventDispatcher(sdkConfig.workerUrl);

        // Get the singleton instance of WebSocketManager
        this.webSocketManager = WebSocketManager.getInstance(sdkConfig.socketUrl);
        this.gameChannel = new SocketGameChannel(this.webSocketManager);
        this.api.game = new GameAPI(sdkConfig.apiUrl, this.token, this.eventDispatcher);
    }

    public async connect(token: string, sessionId: string): Promise<void> {
        try {
            await this.gameChannel.connect(token, sessionId);
            this.authenticated = true;
            console.log('[SDK] oof.gg SDK connected successfully.');
        } catch (error) {
            console.error('[SDK] Failed to connect GameSDK:', error);
            throw error;
        }
    }

    public disconnect(): void {
        this.gameChannel.disconnect();
        this.authenticated = false;
    }
}

export { GameSDK, SDKConfig, GameInterface };
import { SocketGameChannel } from './connections/SocketGameChannel';
import { SocketGlobalChannel } from './connections/SocketGlobalChannel';
import { EventDispatcher } from './events/EventDispatcher';
import { WebSocketManager } from './connections/WebSocketManager';
import { config } from './config/config';

interface SDKConfig {
    authUrl: string;
    socketUrl: string;
    playerNamespace?: string;
    globalNamespace?: string;
    apiUrl?: string;
    twitch?: object;
    workerUrl?: string;
}

class GameSDK {
    private webSocketManager: WebSocketManager;
    private gameChannel: SocketGameChannel;
    private globalChannel: SocketGlobalChannel;
    private authenticated: boolean = false;
    private eventDispatcher: any;

    public events = {
        local: {
            on: (eventType: any, callback: (data: any) => void) => {
                this.eventDispatcher.subscribe('local', eventType, callback);
            },
            emit: (eventType: any, payload: any, context?: EventTarget) => {
                this.eventDispatcher.emitEvent('local', eventType, payload);
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
                    this.gameChannel.sendEvent(eventType, payload);
                }
            },
            global: {
                on: (eventType: string, callback: (data: any) => void) => {
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

    public init(sdkConfig: SDKConfig) {
        this.eventDispatcher = new EventDispatcher(sdkConfig.workerUrl);
        this.webSocketManager = new WebSocketManager(sdkConfig.socketUrl);
        this.gameChannel = new SocketGameChannel(this.webSocketManager);
        this.globalChannel = new SocketGlobalChannel(this.webSocketManager);
    }

    public async connect(token: string): Promise<void> {
        try {
            await this.gameChannel.connect(token);
            this.authenticated = true;
            console.log('GameSDK connected successfully.');
        } catch (error) {
            console.error('Failed to connect GameSDK:', error);
            throw error;
        }
    }

    public disconnect(): void {
        this.gameChannel.disconnect();
        this.authenticated = false;
    }
}

export { GameSDK, SDKConfig };
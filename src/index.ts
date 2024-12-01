import { SocketGameChannel } from './connections/SocketGameChannel';
import { SocketGlobalChannel } from './connections/SocketGlobalChannel';
import { WebSocketManager } from './connections/WebSocketManager';
import { config } from './config/config';

interface SDKConfig {
    authUrl: string;
    socketUrl: string;
    playerNamespace?: string;
    globalNamespace?: string;
    apiUrl?: string;
    twitch?: object;
}

class GameSDK {
    private webSocketManager: WebSocketManager;
    private gameChannel: SocketGameChannel;
    private globalChannel: SocketGlobalChannel;
    private authenticated: boolean = false;

    public events = {
        local: {
            on: (eventType: string, callback: (data: any) => void) => {
                // Implement local event handling logic here
            },
            emit: (eventType: string, payload: any) => {
                // Implement local event emitting logic here
            }
        },
        websocket: {
            game: {
                on: (eventType: string, callback: (data: any) => void) => {
                    this.gameChannel.onEvent(eventType, callback);
                },
                emit: (eventType: string, payload: any) => {
                    this.gameChannel.sendEvent(eventType, payload);
                }
            },
            global: {
                on: (eventType: string, callback: (data: any) => void) => {
                    this.globalChannel.subscribeToGlobalEvent(eventType, callback);
                }
            }
        }
    };

    constructor(private sdkConfig: SDKConfig) {
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
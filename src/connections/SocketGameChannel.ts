import { WebSocketManager } from './WebSocketManager';

export class SocketGameChannel {
    private readonly namespace: string = '/game';
    private readonly webSocketManager: WebSocketManager;

    constructor(webSocketManager: WebSocketManager) {
        this.webSocketManager = webSocketManager;
    }

    public async connect(token: string): Promise<void> {
        try {
            await this.webSocketManager.connect(token);
            console.log('Connected to game WebSocket channel.');
        } catch (error) {
            console.error('Failed to connect to game WebSocket channel:', error);
            throw error;
        }
    }

    public sendEvent(eventType: string, payload: any): void {
        this.webSocketManager.sendEvent(eventType, payload);
    }

    public onEvent(eventType: string, callback: (data: any) => void): void {
        this.webSocketManager.onEvent(eventType, callback);
    }

    public disconnect(): void {
        this.webSocketManager.disconnect();
    }
}
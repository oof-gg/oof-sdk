import { WebSocketManager } from './WebSocketManager';

export class GameWebSocket {
    private readonly namespace: string = '/game';
    private readonly webSocketManager: WebSocketManager;

    constructor(private url: string, private token: string) {
        this.webSocketManager = new WebSocketManager(`${this.url}${this.namespace}`);
    }

    /**
     * Connects to the game WebSocket channel with JWT authentication.
     */
    public async connect(): Promise<void> {
        try {
            await this.webSocketManager.connect(this.token);
            console.log('Connected to game WebSocket channel.');
        } catch (error) {
            console.error('Failed to connect to game WebSocket channel:', error);
            throw error;
        }
    }

    /**
     * Sends a game event.
     * @param eventType - The event type to send (e.g., "player-move").
     * @param payload - The payload to send with the event.
     */
    public sendEvent(eventType: string, payload: any): void {
        this.webSocketManager.sendEvent(eventType, payload);
    }

    /**
     * Subscribes to a game event.
     * @param eventType - The event type to listen for (e.g., "game-state").
     * @param callback - The function to execute when the event is received.
     */
    public onEvent(eventType: string, callback: (data: any) => void): void {
        this.webSocketManager.onEvent(eventType, callback);
    }

    /**
     * Disconnects from the game WebSocket channel.
     */
    public disconnect(): void {
        this.webSocketManager.disconnect();
    }
}

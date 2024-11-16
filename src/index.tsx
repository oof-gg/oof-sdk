import { GameWebSocket } from './connections/SocketGameChannel';

interface SDKConfig {
    authUrl: string;
    socketUrl: string;
}

export class GameSDK {
    private gameWebSocket: GameWebSocket | null = null;
    private isAuthenticated = false;

    // pass in generated token from App wrapper that loads the game
    constructor(private config: SDKConfig, private authToken: string) {
        if (!authToken)
          throw new Error('No authentication token provided.');
    }

    /**
     * Initializes the SDK by authenticating the player and preparing the WebSocket connection.
     */
    public async initialize(): Promise<void> {
        // Authenticate the player
        console.log('Player authenticated successfully.');

        try {
          // Prepare the game WebSocket connection
          this.gameWebSocket = new GameWebSocket(this.config.socketUrl, this.authToken);
          await this.gameWebSocket.connect();
          this.isAuthenticated = true;
          console.log('Game WebSocket connected.');
        } catch (error) {
          console.error('Failed to connect to game WebSocket:', error);
          throw error;
        }
    }

    /**
     * Sends an event through the game WebSocket.
     * @param eventType - The type of event to send.
     * @param payload - The event payload.
     */
    public sendEvent(eventType: string, payload: any): void {
        if (!this.gameWebSocket) {
            console.error('Game WebSocket is not connected.');
            return;
        }
        this.gameWebSocket.sendEvent(eventType, payload);
    }

    /**
     * Listens for an event from the game WebSocket.
     * @param eventType - The type of event to listen for.
     * @param callback - The function to execute when the event is received.
     */
    public onEvent(eventType: string, callback: (data: any) => void): void {
        if (!this.gameWebSocket) {
            console.error('Game WebSocket is not connected.');
            return;
        }
        this.gameWebSocket.onEvent(eventType, callback);
    }

    /**
     * Disconnects the game WebSocket.
     */
    public disconnect(): void {
        if (this.gameWebSocket) {
            this.gameWebSocket.disconnect();
            console.log('Game WebSocket disconnected.');
        } else {
            console.warn('No active game WebSocket to disconnect.');
        }
    }
}

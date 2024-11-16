import { io, Socket } from 'socket.io-client';

export class WebSocketManager {
    private socket: Socket | null = null;

    constructor(private url: string) {}

    /**
     * Connects to the WebSocket server and authenticates with a JWT.
     * @param token - The JWT for authentication.
     */
    public connect(token: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.socket) {
                reject(new Error('WebSocket is already connected.'));
                return;
            }

            this.socket = io(this.url, {
                query: { token }, // Send JWT as part of the connection query
                secure: true,
                transports: ['websocket'], // Ensure WebSocket transport
            });

            this.socket.on('connect', () => {
                console.log('WebSocket connected.');
                resolve();
            });

            this.socket.on('connect_error', (error) => {
                console.error('WebSocket connection error:', error);
                reject(new Error('WebSocket authentication failed.'));
            });

            this.socket.on('disconnect', () => {
                console.warn('WebSocket disconnected.');
            });
        });
    }

    /**
     * Sends an event after ensuring the WebSocket is authenticated and connected.
     * @param eventType - The event type to send.
     * @param payload - The payload to send.
     */
    public sendEvent(eventType: string, payload: any): void {
        if (!this.socket || !this.socket.connected) {
            console.error('Cannot send event: WebSocket is not connected.');
            return;
        }
        this.socket.emit(eventType, payload);
    }

    /**
     * Subscribes to an event from the server.
     * @param eventType - The event type to listen for.
     * @param callback - The function to execute when the event is received.
     */
    public onEvent(eventType: string, callback: (data: any) => void): void {
        if (!this.socket) {
            console.error('Cannot subscribe to event: WebSocket is not connected.');
            return;
        }
        this.socket.on(eventType, callback);
    }

    /**
     * Disconnects the WebSocket connection.
     */
    public disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            console.log('WebSocket connection closed.');
        }
    }
}

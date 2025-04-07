export interface WebSocketMessage {
    type: string;
    instance_id?: string;
    data?: any;
    error?: string;
}
  
export class WebSocketManager {
    private static instance: WebSocketManager | null = null;
    private socket: WebSocket | null = null;
    private eventHandlers: Map<string, ((data: any) => void)[]> = new Map();
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;
    private url: string;
    private token: string = '';

    constructor(baseUrl: string) {
        this.url = baseUrl;
    }

    public async connect(token: string, sessionId: string): Promise<void> {
        this.token = token;
        
        return new Promise((resolve, reject) => {
        try {
            // Use token as query parameter for authentication
            let _sessionId = '';
            if(sessionId) {
                console.log(`[SDK] Setting "sessionId" as ${sessionId}`);
                _sessionId = `/${sessionId}`;
            }

            const url = `${this.url}${_sessionId}?token=${encodeURIComponent(token)}`;
            this.socket = new WebSocket(url);
            
            this.socket.onopen = () => {
            console.log('[SDK] WebSocket connection established');
            this.reconnectAttempts = 0;
            resolve();
            };
            
            this.socket.onmessage = (event) => {
            try {
                const message: WebSocketMessage = JSON.parse(event.data);
                this.handleMessage(message);
            } catch (e) {
                console.error('[SDK] Error parsing WebSocket message:', e);
            }
            };
            
            this.socket.onerror = (error) => {
            console.error('[SDK] WebSocket error:', error);
            reject(error);
            };
            
            this.socket.onclose = (event) => {
            console.log(`[SDK] WebSocket closed: ${event.code} ${event.reason}`);
            
            // Attempt to reconnect if not a clean close
            if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnectAttempts++;
                const delay = this.reconnectDelay * this.reconnectAttempts;
                console.log(`[SDK] Attempting to reconnect in ${delay}ms...`);
                
                setTimeout(() => {
                this.connect(this.token, sessionId).catch(e => {
                    console.error('[SDK] Reconnection failed:', e);
                });
                }, delay);
            }
            };
        } catch (error) {
            reject(error);
        }
        });
    }

    // Singleton pattern to ensure only one instance of WebSocketManager
    public static getInstance(baseUrl: string): WebSocketManager {
        if (!this.instance) {
        this.instance = new WebSocketManager(baseUrl);
        }
        return this.instance;
    }

    public subscribeToInstance(instanceId: string): void {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        throw new Error('[SDK] WebSocket is not connected');
        }
        
        const message: WebSocketMessage = {
        type: 'subscribe',
        instance_id: instanceId
        };
        
        this.socket.send(JSON.stringify(message));
    }

    public sendMessage(message: WebSocketMessage): void {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        throw new Error('[SDK] WebSocket is not connected');
        }
        
        this.socket.send(JSON.stringify(message));
    }

    public onEvent(eventType: string, callback: (data: any) => void): void {
        if (!this.eventHandlers.has(eventType)) {
        this.eventHandlers.set(eventType, []);
        }
        
        this.eventHandlers.get(eventType)?.push(callback);
    }

    /**
     * Send a custom event to the server
     * @param eventType The type of event to send
     * @param data The data to include with the event
     * @param instanceId Optional instance ID if this event relates to a specific instance
     */
    public sendEvent(eventType: string, data: any): void {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            throw new Error('[SDK] WebSocket is not connected');
        }

        const message: WebSocketMessage = {
            type: eventType,
            data: data
        };

        this.socket.send(JSON.stringify(message));
    }

    private handleMessage(message: WebSocketMessage): void {
        // Trigger callbacks for this message type
        const handlers = this.eventHandlers.get(message.type) || [];
        
        for (const handler of handlers) {
        try {
            handler(message.data);
        } catch (e) {
            console.error(`[SDK] Error in handler for event type ${message.type}:`, e);
        }
        }
        
        // Also handle specific message types
        if (message.type === 'error' && message.error) {
        console.error('[SDK] Server error:', message.error);
        }
    }

    public disconnect(): void {
        if (this.socket) {
        this.socket.close();
        this.socket = null;
        }
    }

    public isConnected(): boolean {
        return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
    }
}
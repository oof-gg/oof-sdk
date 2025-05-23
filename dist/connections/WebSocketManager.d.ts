export interface WebSocketMessage {
    type: string;
    instance_id?: string;
    data?: any;
    error?: string;
}
export declare class WebSocketManager {
    private static instance;
    private socket;
    private eventHandlers;
    private reconnectAttempts;
    private maxReconnectAttempts;
    private reconnectDelay;
    private url;
    private token;
    constructor(baseUrl: string);
    connect(token: string, sessionId: string): Promise<void>;
    static getInstance(baseUrl: string): WebSocketManager;
    subscribeToInstance(instanceId: string): void;
    sendMessage(message: WebSocketMessage): void;
    onEvent(eventType: string, callback: (data: any) => void): void;
    /**
     * Send a custom event to the server
     * @param eventType The type of event to send
     * @param data The data to include with the event
     * @param instanceId Optional instance ID if this event relates to a specific instance
     */
    sendEvent(eventType: string, data: any): void;
    private handleMessage;
    disconnect(): void;
    isConnected(): boolean;
}

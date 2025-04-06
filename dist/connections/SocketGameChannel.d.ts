import { WebSocketManager } from './WebSocketManager';
export declare class SocketGameChannel {
    private readonly namespace;
    private readonly webSocketManager;
    constructor(webSocketManager: WebSocketManager);
    connect(token: string, sessionId: string): Promise<void>;
    sendEvent(eventType: string, payload: any): void;
    onEvent(eventType: string, callback: (data: any) => void): void;
    disconnect(): void;
}

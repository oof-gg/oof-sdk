import { WebSocketManager } from './WebSocketManager';
export declare class SocketGlobalChannel {
    private readonly namespace;
    private readonly webSocketManager;
    constructor(webSocketManager: WebSocketManager);
    subscribeToGlobalEvent(eventType: string, callback: (data: any) => void): void;
}

import { WebSocketManager } from './WebSocketManager';
import { global_event } from '@oof.gg/protobuf-ts';

export class SocketGlobalChannel {
    private readonly namespace: string = '/global';
    private readonly webSocketManager: WebSocketManager;

    constructor(webSocketManager: WebSocketManager) {
        this.webSocketManager = webSocketManager;
    }

    public subscribeToGlobalEvent(eventType: string, callback: (data: any) => void): void {
        this.webSocketManager.onEvent(eventType, (data: Uint8Array) => {
            const event = global_event.GlobalEvent.decode(data);
            callback(event);
        });
    }
}
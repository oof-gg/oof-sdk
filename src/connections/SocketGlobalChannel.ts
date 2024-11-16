import { WebSocketManager } from './WebSocketManager';
import { GlobalEvent } from '@oof.gg/protobuf-ts/dist/global/event';

export class SocketGlobalChannel {
    constructor(private socketManager: WebSocketManager) {}

    public subscribeToGlobalEvent(eventType: string, callback: (data: any) => void): void {
        this.socketManager.onEvent(eventType, (data: Uint8Array) => {
            const event = GlobalEvent.decode(data);
            callback(event);
        });
    }
}

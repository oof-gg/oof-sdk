import { EventEmitter } from 'events';

export class EventDispatcher extends EventEmitter {
    emitEvent(eventType: string, data: any): void {
        super.emit(eventType, data);
    }

    subscribe(eventType: string, callback: (data: any) => void): void {
        super.on(eventType, callback);
    }
}
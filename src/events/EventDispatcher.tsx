import { EventEmitter } from 'events';

export class EventDispatcher extends EventEmitter {
    emitEvent(eventType: string, data: any): void {
        this.emit(eventType, data);
    }

    subscribe(eventType: string, callback: (data: any) => void): void {
        this.on(eventType, callback);
    }
}
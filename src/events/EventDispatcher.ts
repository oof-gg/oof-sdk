import { EventEmitter } from 'events';

export class EventDispatcher extends EventEmitter {
    emitEvent(namespace: string, eventType: string, data: any): void {
        super.emit(`${namespace}.${eventType}`, data);
    }

    subscribe(namespace: string, eventType: string, callback: (data: any) => void): void {
        super.on(`${namespace}.${eventType}`, callback);
    }

    unsubscribe(namespace: string, eventType: string, callback: (data: any) => void): void {
        super.off(`${namespace}.${eventType}`, callback);
    }
}
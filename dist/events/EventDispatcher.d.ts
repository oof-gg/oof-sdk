/// <reference types="node" />
import { EventEmitter } from 'events';
export declare class EventDispatcher extends EventEmitter {
    private workerUrl;
    private eventLog;
    private worker;
    private port;
    private eventListeners;
    constructor(workerUrl?: string);
    emitEvent(namespace: string, eventType: string, data: any): void;
    subscribe(namespace: string, eventType: string, callback: (data: any) => void): void;
    unsubscribe(namespace: string, eventType: string): void;
    private isAllowedEvent;
    getEventLog(): {
        [key: string]: number;
    };
}

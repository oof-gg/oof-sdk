/// <reference types="node" />
import { EventEmitter } from 'events';
export declare class EventDispatcher extends EventEmitter {
    emitEvent(namespace: string, eventType: string, data: any): void;
    subscribe(namespace: string, eventType: string, callback: (data: any) => void): void;
    unsubscribe(namespace: string, eventType: string, callback: (data: any) => void): void;
}

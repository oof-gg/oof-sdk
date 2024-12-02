/// <reference types="node" />
import { EventEmitter } from 'events';
export declare class EventDispatcher extends EventEmitter {
    private shadowRoot;
    private eventLog;
    constructor(shadowRoot?: ShadowRoot | null);
    emitEvent(namespace: string, eventType: string, data: any, context?: EventTarget): void;
    getEventLog(): {
        [key: string]: number;
    };
    subscribe(namespace: string, eventType: string, callback: (data: any) => void, context?: EventTarget): void;
    unsubscribe(namespace: string, eventType: string, callback: (data: any) => void, context?: EventTarget): void;
}

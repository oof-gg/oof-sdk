import { EventEmitter } from 'events';
import { game_instance } from '@oof.gg/protobuf-ts';

// Convert the game instance to a JSON object
export class EventDispatcher extends EventEmitter {
    // create a log of all the types of events that are being emitted and subscribed to
    // this is useful for debugging and understanding the flow of events in the application
    private eventLog: { [key: string]: number } = {};
    private worker: SharedWorker | null = null;
    private port: MessagePort;
    private eventListeners: Map<string, (event: MessageEvent) => void> = new Map();
    
    constructor(private shadowRoot: ShadowRoot | null = null) {
        super();
        this.worker = new SharedWorker('/workers/worker.js');
        this.port = this.worker.port
        this.port.onmessage = this.handleWorkerMessage.bind(this);
    }

    private handleWorkerMessage(event: MessageEvent): void {
        const { namespace, eventType, data } = event.data;
        if (this.isAllowedEvent(eventType)) {
            this.emitEvent(namespace, eventType, data);
        }
    }

    emitEvent(namespace: string, eventType: string, data: any): void {
        // log the event type
        if (this.isAllowedEvent(eventType)) {
            const key = `${namespace}.${eventType}`;
            this.eventLog[key] = (this.eventLog[key] || 0) + 1;
            this.port.postMessage({ namespace, eventType, data });
        } else {
            console.warn(`Event type "${eventType}" is not allowed.`);
        }
    }

    subscribe(namespace: string, eventType: string, callback: (data: any) => void): void {
        const key = `${namespace}.${eventType}`;
        const listener = (event: MessageEvent) => {
            if (event.data.namespace === namespace && event.data.eventType === eventType) {
                callback(event.data.data);
            }
        };
        this.eventListeners.set(key, listener);
        this.port.addEventListener('message', listener);
    }

    unsubscribe(namespace: string, eventType: string): void {
        const key = `${namespace}.${eventType}`;
        const listener = this.eventListeners.get(key);
        if (listener) {
            this.port.removeEventListener('message', listener);
            this.eventListeners.delete(key);
        }
    }

    private isAllowedEvent(eventType: string): boolean {
        return Object.values(game_instance.InstanceCommandEnum).includes(eventType) ||
               Object.values(game_instance.InstanceStateEnum).includes(eventType);
    }

    getEventLog(): { [key: string]: number } {
        return this.eventLog;
    }
}
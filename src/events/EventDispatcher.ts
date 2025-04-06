import { EventEmitter } from 'events';

// Convert the game instance to a JSON object
export class EventDispatcher extends EventEmitter {
    // create a log of all the types of events that are being emitted and subscribed to
    // this is useful for debugging and understanding the flow of events in the application
    private eventLog: { [key: string]: number } = {};
    private worker: SharedWorker | null = null;
    private port: MessagePort;
    private eventListeners: Map<string, (event: MessageEvent) => void> = new Map();
    
    constructor(private workerUrl: string = '/workers/worker.js') {
        super();
        if (typeof SharedWorker !== 'undefined') {
            console.log('[EventDispatcher] SharedWorker is supported', workerUrl);
            this.worker = new SharedWorker(workerUrl, 'oof-shared-worker');
            this.port = this.worker.port
        }
    }

    emitEvent(namespace: string, eventType: string, data: any): void {
        // log the event type
        if (this.isAllowedEvent(eventType)) {
            const key = `${namespace}.${eventType}`;
            this.eventLog[key] = (this.eventLog[key] || 0) + 1;
            if (this.port) {
                if(namespace === 'local') {
                    console.log(`[EventDispatcher] Emitting event (worker): ${key}`, data);
                    this.port.postMessage({ namespace, eventType, data });
                }
            } else {
                console.log(`[EventDispatcher] Emitting event (local): ${key}`, data);
                this.emit(key, data);
            }
        } else {
            console.warn(`[EventDispatcher] Event type "${eventType}" is not allowed.`);
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
        if (this.port) {
            this.port.addEventListener('message', listener);
        } else {
            this.on(key, callback);
        }
    }

    unsubscribe(namespace: string, eventType: string): void {
        const key = `${namespace}.${eventType}`;
        const listener = this.eventListeners.get(key);
        if (listener) {
            if (this.port) {
                this.port.removeEventListener('message', listener);
            } else {
                this.off(key, listener);
            }
            this.eventListeners.delete(key);
        }
    }

    private isAllowedEvent(eventType: string): boolean {
        return eventType !== 'DISALLOWED_EVENT';
    }

    getEventLog(): { [key: string]: number } {
        return this.eventLog;
    }
}
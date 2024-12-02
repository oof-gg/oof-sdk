import { EventEmitter } from 'events';

export class EventDispatcher extends EventEmitter {
    // create a log of all the types of events that are being emitted and subscribed to
    // this is useful for debugging and understanding the flow of events in the application
    private eventLog: { [key: string]: number } = {};
    
    constructor(private shadowRoot: ShadowRoot | null = null) {
        super();
    }

    emitEvent(namespace: string, eventType: string, data: any, context?: EventTarget): void {
        const target = context || this.shadowRoot || globalThis;
        if (target) {
            target.dispatchEvent(new CustomEvent(`${namespace}.${eventType}`, {
                detail: data,
                bubbles: true, // Allows the event to bubble up through the DOM
                composed: true // Allows the event to pass through shadow DOM boundaries
            }));
        } else {
            super.emit(`${namespace}.${eventType}`, data);
        }

        // log the event type
        const key = `${namespace}.${eventType}`;
        this.eventLog[key] = (this.eventLog[key] || 0) + 1;
    }

    // getter for the event log
    getEventLog(): { [key: string]: number } {
        return this.eventLog;
    }

    subscribe(namespace: string, eventType: string, callback: (data: any) => void, context?: EventTarget): void {
        const target = context || this.shadowRoot || globalThis;
        if (target) {
            console.log('Subscribing to event:', `${namespace}.${eventType}`);
            target.addEventListener(`${namespace}.${eventType}`, (event: Event) => {
                console.log('Received event:', `${namespace}.${eventType}`, (event as CustomEvent).detail);
                callback((event as CustomEvent).detail);
            });
        } else {
            const key = `${namespace}.${eventType}`;
            super.off(key, callback); // Remove existing listener if any
            super.on(key, callback); // Add the new listener
        }
    }

    unsubscribe(namespace: string, eventType: string, callback: (data: any) => void, context?: EventTarget): void {
        const target = context || this.shadowRoot || globalThis;
        if (target) {
            target.removeEventListener(`${namespace}.${eventType}`, callback as EventListener);
        } else {
            super.off(`${namespace}.${eventType}`, callback);
        }
    }
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDispatcher = void 0;
const events_1 = require("events");
class EventDispatcher extends events_1.EventEmitter {
    constructor(shadowRoot = null) {
        super();
        this.shadowRoot = shadowRoot;
        // create a log of all the types of events that are being emitted and subscribed to
        // this is useful for debugging and understanding the flow of events in the application
        this.eventLog = {};
    }
    emitEvent(namespace, eventType, data, context) {
        const target = context || this.shadowRoot || globalThis;
        if (target) {
            target.dispatchEvent(new CustomEvent(`${namespace}.${eventType}`, {
                detail: data,
                bubbles: true, // Allows the event to bubble up through the DOM
                composed: true // Allows the event to pass through shadow DOM boundaries
            }));
        }
        else {
            super.emit(`${namespace}.${eventType}`, data);
        }
        // log the event type
        const key = `${namespace}.${eventType}`;
        this.eventLog[key] = (this.eventLog[key] || 0) + 1;
    }
    // getter for the event log
    getEventLog() {
        return this.eventLog;
    }
    subscribe(namespace, eventType, callback, context) {
        const target = context || this.shadowRoot || globalThis;
        if (target) {
            console.log('Subscribing to event:', `${namespace}.${eventType}`);
            target.addEventListener(`${namespace}.${eventType}`, (event) => {
                console.log('Received event:', `${namespace}.${eventType}`, event.detail);
                callback(event.detail);
            });
        }
        else {
            const key = `${namespace}.${eventType}`;
            super.off(key, callback); // Remove existing listener if any
            super.on(key, callback); // Add the new listener
        }
    }
    unsubscribe(namespace, eventType, callback, context) {
        const target = context || this.shadowRoot || globalThis;
        if (target) {
            target.removeEventListener(`${namespace}.${eventType}`, callback);
        }
        else {
            super.off(`${namespace}.${eventType}`, callback);
        }
    }
}
exports.EventDispatcher = EventDispatcher;

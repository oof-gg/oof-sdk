"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDispatcher = void 0;
const events_1 = require("events");
// Convert the game instance to a JSON object
class EventDispatcher extends events_1.EventEmitter {
    constructor(workerUrl = '/workers/worker.js') {
        super();
        this.workerUrl = workerUrl;
        // create a log of all the types of events that are being emitted and subscribed to
        // this is useful for debugging and understanding the flow of events in the application
        this.eventLog = {};
        this.worker = null;
        this.eventListeners = new Map();
        if (typeof SharedWorker !== 'undefined') {
            this.worker = new SharedWorker(workerUrl);
            this.port = this.worker.port;
            this.port.onmessage = this.handleWorkerMessage.bind(this);
        }
    }
    handleWorkerMessage(event) {
        const { namespace, eventType, data } = event.data;
        if (this.isAllowedEvent(eventType)) {
            this.emitEvent(namespace, eventType, data);
        }
    }
    emitEvent(namespace, eventType, data) {
        // log the event type
        if (this.isAllowedEvent(eventType)) {
            const key = `${namespace}.${eventType}`;
            this.eventLog[key] = (this.eventLog[key] || 0) + 1;
            if (this.port) {
                this.port.postMessage({ namespace, eventType, data });
            }
            else {
                this.emit(key, data);
            }
        }
        else {
            console.warn(`Event type "${eventType}" is not allowed.`);
        }
    }
    subscribe(namespace, eventType, callback) {
        const key = `${namespace}.${eventType}`;
        const listener = (event) => {
            if (event.data.namespace === namespace && event.data.eventType === eventType) {
                callback(event.data.data);
            }
        };
        this.eventListeners.set(key, listener);
        if (this.port) {
            this.port.addEventListener('message', listener);
        }
        else {
            this.on(key, callback);
        }
    }
    unsubscribe(namespace, eventType) {
        const key = `${namespace}.${eventType}`;
        const listener = this.eventListeners.get(key);
        if (listener) {
            if (this.port) {
                this.port.removeEventListener('message', listener);
            }
            else {
                this.off(key, listener);
            }
            this.eventListeners.delete(key);
        }
    }
    isAllowedEvent(eventType) {
        return eventType !== 'DISALLOWED_EVENT';
    }
    getEventLog() {
        return this.eventLog;
    }
}
exports.EventDispatcher = EventDispatcher;

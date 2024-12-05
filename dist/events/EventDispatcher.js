"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDispatcher = void 0;
const events_1 = require("events");
const protobuf_ts_1 = require("@oof.gg/protobuf-ts");
// Convert the game instance to a JSON object
class EventDispatcher extends events_1.EventEmitter {
    constructor(shadowRoot = null) {
        super();
        this.shadowRoot = shadowRoot;
        // create a log of all the types of events that are being emitted and subscribed to
        // this is useful for debugging and understanding the flow of events in the application
        this.eventLog = {};
        this.worker = null;
        this.eventListeners = new Map();
        this.worker = new SharedWorker('/workers/worker.js');
        this.port = this.worker.port;
        this.port.onmessage = this.handleWorkerMessage.bind(this);
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
            this.port.postMessage({ namespace, eventType, data });
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
        this.port.addEventListener('message', listener);
    }
    unsubscribe(namespace, eventType) {
        const key = `${namespace}.${eventType}`;
        const listener = this.eventListeners.get(key);
        if (listener) {
            this.port.removeEventListener('message', listener);
            this.eventListeners.delete(key);
        }
    }
    isAllowedEvent(eventType) {
        return Object.values(protobuf_ts_1.game_instance.InstanceCommandEnum).includes(eventType) ||
            Object.values(protobuf_ts_1.game_instance.InstanceStateEnum).includes(eventType);
    }
    getEventLog() {
        return this.eventLog;
    }
}
exports.EventDispatcher = EventDispatcher;

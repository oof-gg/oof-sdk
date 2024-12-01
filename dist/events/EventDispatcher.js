"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDispatcher = void 0;
const events_1 = require("events");
class EventDispatcher extends events_1.EventEmitter {
    emitEvent(namespace, eventType, data) {
        super.emit(`${namespace}.${eventType}`, data);
    }
    subscribe(namespace, eventType, callback) {
        super.on(`${namespace}.${eventType}`, callback);
    }
    unsubscribe(namespace, eventType, callback) {
        super.off(`${namespace}.${eventType}`, callback);
    }
}
exports.EventDispatcher = EventDispatcher;

import { EventDispatcher } from '../src/events/EventDispatcher';

describe('EventDispatcher', () => {
    let dispatcher: EventDispatcher;

    beforeEach(() => {
        dispatcher = new EventDispatcher();
    });

    test('should emit and handle allowed events', () => {
        const callback = jest.fn();
        dispatcher.subscribe('app', 'INITIALIZING', callback);

        dispatcher.emitEvent('app', 'INITIALIZING', { message: 'Initializing' });

        expect(callback).toHaveBeenCalledWith({ message: 'Initializing' });
    });

    test('should not emit disallowed events', () => {
        const callback = jest.fn();
        dispatcher.subscribe('app', 'DISALLOWED_EVENT', callback);

        dispatcher.emitEvent('app', 'DISALLOWED_EVENT', { message: 'This should not be emitted' });

        expect(callback).not.toHaveBeenCalled();
    });

    test('should log events', () => {
        dispatcher.emitEvent('app', 'RUNNING', { message: 'Running' });

        const eventLog = dispatcher.getEventLog();
        expect(eventLog['app.RUNNING']).toBe(1);
    });

    test('should handle multiple subscriptions', () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();

        dispatcher.subscribe('app', 'PAUSED', callback1);
        dispatcher.subscribe('app', 'PAUSED', callback2);

        dispatcher.emitEvent('app', 'PAUSED', { message: 'Paused' });

        expect(callback1).toHaveBeenCalledWith({ message: 'Paused' });
        expect(callback2).toHaveBeenCalledWith({ message: 'Paused' });
    });
});
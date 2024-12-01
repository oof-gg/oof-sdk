export declare class WebSocketManager {
    private url;
    private socket;
    constructor(url: string);
    connect(token: string): Promise<void>;
    sendEvent(eventType: string, payload: any): void;
    onEvent(eventType: string, callback: (data: any) => void): void;
    disconnect(): void;
}

import { io, Socket } from 'socket.io-client';

export class WebSocketManager {
    private socket: Socket;

    constructor(private url: string) {
        this.socket = io(this.url);
    }

    public async connect(token: string): Promise<void> {
        this.socket.auth = { token };
        this.socket.connect();
    }

    public sendEvent(eventType: string, payload: any): void {
        this.socket.emit(eventType, payload);
    }

    public onEvent(eventType: string, callback: (data: any) => void): void {
        this.socket.on(eventType, callback);
    }

    public disconnect(): void {
        this.socket.disconnect();
    }
}
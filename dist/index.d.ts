import GameInterface from './utils/game';
interface SDKConfig {
    socketUrl: string;
    playerNamespace?: string;
    token?: string;
    globalNamespace?: string;
    apiUrl?: string;
    twitch?: object;
    workerUrl?: string;
}
declare class GameSDK {
    private webSocketManager;
    private gameChannel;
    private authenticated;
    private eventDispatcher;
    private token;
    api: any;
    events: {
        local: {
            on: (eventType: any, callback: (data: any) => void) => void;
            emit: (eventType: any, payload: any, context?: EventTarget) => void;
            off: (eventType: any) => void;
        };
        web: {
            game: {
                on: (eventType: string, callback: (data: any) => void) => void;
                emit: (eventType: string, payload: any) => void;
            };
        };
        log: {
            getEventLog: () => any;
        };
    };
    init(sdkConfig: SDKConfig): void;
    connect(token: string, sessionId: string): Promise<void>;
    disconnect(): void;
}
export { GameSDK, SDKConfig, GameInterface };

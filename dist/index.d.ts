interface SDKConfig {
    authUrl: string;
    socketUrl: string;
    playerNamespace?: string;
    globalNamespace?: string;
    apiUrl?: string;
    twitch?: object;
}
declare class GameSDK {
    private sdkConfig;
    private webSocketManager;
    private gameChannel;
    private globalChannel;
    private authenticated;
    events: {
        local: {
            on: (eventType: any, callback: (data: any) => void) => void;
            emit: (eventType: any, payload: any) => void;
        };
        websocket: {
            game: {
                on: (eventType: any, callback: (data: any) => void) => void;
                emit: (eventType: any, payload: any) => void;
            };
            global: {
                on: (eventType: any, callback: (data: any) => void) => void;
            };
        };
    };
    constructor(sdkConfig: SDKConfig);
    connect(token: string): Promise<void>;
    disconnect(): void;
}
export { GameSDK, SDKConfig };

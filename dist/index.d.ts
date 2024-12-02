interface SDKConfig {
    authUrl: string;
    socketUrl: string;
    playerNamespace?: string;
    globalNamespace?: string;
    apiUrl?: string;
    twitch?: object;
}
declare class GameSDK {
    private webSocketManager;
    private gameChannel;
    private globalChannel;
    private authenticated;
    private eventDispatcher;
    events: {
        local: {
            on: (eventType: any, callback: (data: any) => void, context?: EventTarget) => void;
            emit: (eventType: any, payload: any, context?: EventTarget) => void;
        };
        web: {
            game: {
                on: (eventType: string, callback: (data: any) => void, context?: EventTarget) => void;
                emit: (eventType: string, payload: any) => void;
            };
            global: {
                on: (eventType: string, callback: (data: any) => void, context?: EventTarget) => void;
            };
        };
        log: {
            getEventLog: () => any;
        };
    };
    init(sdkConfig: SDKConfig, shadowRoot?: ShadowRoot | null): void;
    connect(token: string): Promise<void>;
    disconnect(): void;
}
export { GameSDK, SDKConfig };

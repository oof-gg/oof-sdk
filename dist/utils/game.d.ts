export default interface GameInterface {
    initConfig(config: any): void;
    load(): Promise<void>;
    start(): void;
    pause(): void;
    resume(): void;
    unload(): Promise<void>;
}

// Game Class to use as "implements"

export default interface GameInterface {

  // Initialization
  initConfig(config: any): void;

  // Lifecycle
  load(): Promise<void>;
  start(): void;
  pause(): void;
  resume(): void;
  unload(): Promise<void>;
}
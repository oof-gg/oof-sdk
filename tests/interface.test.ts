export interface Game {
  start(): void;
  pause(): void;
  resume(): void;
  stop(): void;
  abort(): void;
  shutdown(): void;
}

describe('Game Interface', () => {
  let game: Game;

  beforeEach(() => {
    game = {
      start: jest.fn(),
      pause: jest.fn(),
      resume: jest.fn(),
      stop: jest.fn(),
      abort: jest.fn(),
      shutdown: jest.fn(),
    };
  });

  test('should start the game', () => {
    game.start();
    expect(game.start).toHaveBeenCalled();
  });

  test('should pause the game', () => {
    game.pause();
    expect(game.pause).toHaveBeenCalled();
  });

  test('should resume the game', () => {
    game.resume();
    expect(game.resume).toHaveBeenCalled();
  });

  test('should stop the game', () => {
    game.stop();
    expect(game.stop).toHaveBeenCalled();
  });

  test('should abort the game', () => {
    game.abort();
    expect(game.abort).toHaveBeenCalled();
  });

  test('should shutdown the game', () => {
    game.shutdown();
    expect(game.shutdown).toHaveBeenCalled();
  });
});
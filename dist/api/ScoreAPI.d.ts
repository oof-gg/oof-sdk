import { Session } from '@oof.gg/protobuf-ts/dist/game/session';
export declare class ScoreAPI {
    private baseUrl;
    constructor(baseUrl: string);
    /**
     * Updates the score for a specific game.
     * @param gameId - The ID of the game.
     * @param playerId - The ID of the player whose score is being updated.
     * @param score - The updated score value.
     * @returns A promise resolving to the response.
     */
    updateScore(gameId: string): Promise<Session>;
    /**
     * Fetches the current score for a specific game and player.
     * @param gameId - The ID of the game.
     * @param playerId - The ID of the player.
     * @returns A promise resolving to the player's score.
     */
    fetchScore(gameId: string, playerId: string): Promise<Session>;
}

import axios from 'axios';
import { Session } from '@oof.gg/protobuf-ts/dist/game/session';

export class ScoreAPI {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    /**
     * Updates the score for a specific game.
     * @param gameId - The ID of the game.
     * @param playerId - The ID of the player whose score is being updated.
     * @param score - The updated score value.
     * @returns A promise resolving to the response.
     */
    public async updateScore(gameId: string): Promise<Session> {
        // Create the Protobuf request object
        const request = Session.create({
            gameId
        });

        // Serialize the request using Protobuf
        const encodedRequest = Session.encode(request).finish();

        // Send the request to the API
        const response = await axios.post(`${this.baseUrl}/score/update`, encodedRequest, {
            headers: {
                'Content-Type': 'application/x-protobuf',
            },
            responseType: 'arraybuffer', // Ensure we receive Protobuf data
        });

        // Deserialize the Protobuf response
        const decodedResponse = Session.decode(new Uint8Array(response.data));

        return decodedResponse;
    }

    /**
     * Fetches the current score for a specific game and player.
     * @param gameId - The ID of the game.
     * @param playerId - The ID of the player.
     * @returns A promise resolving to the player's score.
     */
    public async fetchScore(gameId: string, playerId: string): Promise<Session> {
        // Construct the query parameters
        const params = new URLSearchParams({ gameId, playerId });

        // Send the request to the API
        const response = await axios.get(`${this.baseUrl}/score?${params.toString()}`, {
            headers: {
                'Accept': 'application/x-protobuf',
            },
            responseType: 'arraybuffer', // Ensure we receive Protobuf data
        });

        // Deserialize the Protobuf response
        const decodedResponse = Session.decode(new Uint8Array(response.data));

        return decodedResponse;
    }
}
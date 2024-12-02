"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreAPI = void 0;
const axios_1 = require("axios");
const session_1 = require("@oof.gg/protobuf-ts/dist/game/session");
class ScoreAPI {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    /**
     * Updates the score for a specific game.
     * @param gameId - The ID of the game.
     * @param playerId - The ID of the player whose score is being updated.
     * @param score - The updated score value.
     * @returns A promise resolving to the response.
     */
    async updateScore(gameId) {
        // Create the Protobuf request object
        const request = session_1.Session.create({
            gameId
        });
        // Serialize the request using Protobuf
        const encodedRequest = session_1.Session.encode(request).finish();
        // Send the request to the API
        const response = await axios_1.default.post(`${this.baseUrl}/score/update`, encodedRequest, {
            headers: {
                'Content-Type': 'application/x-protobuf',
            },
            responseType: 'arraybuffer', // Ensure we receive Protobuf data
        });
        // Deserialize the Protobuf response
        const decodedResponse = session_1.Session.decode(new Uint8Array(response.data));
        return decodedResponse;
    }
    /**
     * Fetches the current score for a specific game and player.
     * @param gameId - The ID of the game.
     * @param playerId - The ID of the player.
     * @returns A promise resolving to the player's score.
     */
    async fetchScore(gameId, playerId) {
        // Construct the query parameters
        const params = new URLSearchParams({ gameId, playerId });
        // Send the request to the API
        const response = await axios_1.default.get(`${this.baseUrl}/score?${params.toString()}`, {
            headers: {
                'Accept': 'application/x-protobuf',
            },
            responseType: 'arraybuffer', // Ensure we receive Protobuf data
        });
        // Deserialize the Protobuf response
        const decodedResponse = session_1.Session.decode(new Uint8Array(response.data));
        return decodedResponse;
    }
}
exports.ScoreAPI = ScoreAPI;

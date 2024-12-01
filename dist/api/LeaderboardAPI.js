"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardAPI = void 0;
const axios_1 = require("axios");
const session_1 = require("@oof.gg/protobuf-ts/dist/game/session");
class LeaderboardAPI {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    async fetchLeaderboard(gameId) {
        const request = session_1.Session.create({ gameId });
        const encodedRequest = session_1.Session.encode(request).finish();
        const response = await axios_1.default.post(`${this.baseUrl}/leaderboard`, encodedRequest, {
            headers: { 'Content-Type': 'application/x-protobuf' }
        });
        return session_1.Session.decode(new Uint8Array(response.data));
    }
}
exports.LeaderboardAPI = LeaderboardAPI;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protobuf_ts_web_1 = require("@oof.gg/protobuf-ts-web");
class PlayerAPI {
    constructor(baseUrl, token) {
        this.token = token;
        this.baseUrl = baseUrl;
        this.playerService = new protobuf_ts_web_1.v1_api_player_Player_serviceServiceClientPb.PlayerServiceClient(this.baseUrl);
    }
    // Fetches the player data by ID
    async getPlayer(playerId) {
        const request = new protobuf_ts_web_1.v1_api_player_player_pb.PlayerGet();
        // Set the playerId in the request
        if (playerId) {
            request.setId(playerId);
        }
        // header 
        const headers = {
            'Authorization': `Bearer ${this.token}`,
        };
        return new Promise((resolve, reject) => {
            this.playerService.getPlayer(request, headers, (err, response) => {
                if (err) {
                    console.error('Error fetching player data:', err);
                    reject(err);
                }
                else {
                    resolve(response);
                }
            });
        });
    }
}
exports.default = PlayerAPI;

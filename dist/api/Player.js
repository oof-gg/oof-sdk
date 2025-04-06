"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protobuf_ts_web_1 = require("@oof.gg/protobuf-ts-web");
class PlayerAPI {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.playerService = new protobuf_ts_web_1.v1_api_player_Player_serviceServiceClientPb.PlayerServiceClient(this.baseUrl);
    }
}
exports.default = PlayerAPI;

import { v1_api_player_Player_serviceServiceClientPb } from "@oof.gg/protobuf-ts-web";

export default class PlayerAPI {
    private baseUrl: string;
    private playerService: v1_api_player_Player_serviceServiceClientPb.PlayerServiceClient;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.playerService = new v1_api_player_Player_serviceServiceClientPb.PlayerServiceClient(this.baseUrl);
    }
}
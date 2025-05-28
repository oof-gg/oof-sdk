import { v1_api_player_Player_serviceServiceClientPb, v1_api_player_player_pb } from "@oof.gg/protobuf-ts-web";

export default class PlayerAPI {
    private baseUrl: string;
    private playerService: v1_api_player_Player_serviceServiceClientPb.PlayerServiceClient;
    private token: string;

    constructor(baseUrl: string, token: string) {
        this.token = token;
        this.baseUrl = baseUrl;
        this.playerService = new v1_api_player_Player_serviceServiceClientPb.PlayerServiceClient(this.baseUrl);
    }

    // Fetches the player data by ID
    public async getPlayer(playerId?: string): Promise<any> {
        const request = new v1_api_player_player_pb.PlayerGet();

        // Set the playerId in the request
        if(playerId) {
            request.setId(playerId);
        }

        // header 
        const headers = {
            'Authorization': `Bearer ${this.token}`,
        };
        
        return new Promise((resolve, reject) => {
            this.playerService.getPlayer(request, headers, (err: any, response: any) => {
                if (err) {
                    console.error('Error fetching player data:', err);
                    reject(err);
                } else {
                    resolve(response);
                }
            });
        });
    }

}
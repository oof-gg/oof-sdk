import { v1_api_game_game_pb, v1_api_game_Game_serviceServiceClientPb, v1_api_game_join_leave_pb, v1_api_game_session_pb } from "@oof.gg/protobuf-ts-web";
import { StorageService } from "../storage/StorageService";

export class GameAPI {
    private baseUrl: string;
    private gameService: v1_api_game_Game_serviceServiceClientPb.GameServiceClient;
    private token: string;

    private sessionKey: string = 'oof_sdk_sessionId';
    private storageService: StorageService;

    constructor(baseUrl: string, token: string) {
        this.token = token;
        this.baseUrl = baseUrl;
        this.gameService = new v1_api_game_Game_serviceServiceClientPb.GameServiceClient(this.baseUrl);
        this.storageService = new StorageService();
    }

    /**
    * Tries to retrieve the sessionId either from parameter or local storage.
    */
    private async getSessionId(sessionId?: string): Promise<string | null> {
        return sessionId ?? await this.storageService.getItem(this.sessionKey);
    }

    // Sets the sessionId in local storage.
    private async setSessionId(sessionId: string): Promise<void> {
        return await this.storageService.setItem(this.sessionKey, sessionId);
    }

    public async joinGame(userId: string, gameId: string, sessionId?: string): Promise<any> {
        const request = new v1_api_game_join_leave_pb.JoinLeaveGame();
        const currentSessionId = await this.getSessionId(sessionId);
        
        // Set the userId and gameId in the request
        request.setUserId(userId);
        request.setGameId(gameId);
        request.setAction(v1_api_game_join_leave_pb.JoinLeaveGame.Action.JOIN);

        // If a session exists, attach it to the request if your protobuf definition supports it
        if (currentSessionId && typeof (request as any).setSessionId === 'function') {
            console.log('[SDK] Setting sessionId:', currentSessionId);
            (request as any).setSessionId(currentSessionId);
        }

        // Set Authorization header
        const headers = {
            'Authorization': `Bearer ${this.token}`,
        };

        return new Promise((resolve, reject) => {
            this.gameService.joinLeave(request, headers, (err: any, response: any) => {
                if (err) {
                    reject(new Error(err.message));
                } else {
                    resolve(response);
                }
            });
        });
    }



    public async leaveGame(userId: string, gameId: string): Promise<any> {
        const request = new v1_api_game_join_leave_pb.JoinLeaveGame();
        request.setUserId(userId);
        request.setGameId(gameId);
        request.setAction(v1_api_game_join_leave_pb.JoinLeaveGame.Action.LEAVE);

        // Set Authorization header
        const headers = {
            'Authorization': `Bearer ${this.token}`,
        };

        return new Promise(async (resolve, reject) => {
            this.gameService.joinLeave(request, headers, (err: any, response: any) => {
                if (err) {
                    reject(new Error(err.message));
                } else {
                    resolve(response);
                }
            });
        });
    }

    public handleResponse(response: any) {
        // Decode the response from the server
        const decodedResponse = v1_api_game_game_pb.StandardResponse.deserializeBinary(response.serializeBinary());
        return decodedResponse.toObject();
    }
}

export default GameAPI;
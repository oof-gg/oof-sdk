import { v1_api_game_game_pb } from "@oof.gg/protobuf-ts-web";
export declare class GameAPI {
    private baseUrl;
    private gameService;
    private token;
    private sessionKey;
    private storageService;
    constructor(baseUrl: string, token: string);
    /**
    * Tries to retrieve the sessionId either from parameter or local storage.
    */
    private getSessionId;
    private setSessionId;
    joinGame(userId: string, gameId: string, sessionId?: string): Promise<any>;
    leaveGame(userId: string, gameId: string): Promise<any>;
    handleResponse(response: any): v1_api_game_game_pb.StandardResponse.AsObject;
}
export default GameAPI;

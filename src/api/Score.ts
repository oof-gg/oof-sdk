import { v1_api_score_Score_service_pb, v1_api_score_Score_serviceServiceClientPb, v1_api_score_score_pb } from "@oof.gg/protobuf-ts-web";
import { StorageService } from "../storage/StorageService";

export default class ScoreAPI {
    private baseUrl: string;
    //private statService: v1_api_game_Game_serviceServiceClientPb.GameServiceClient;
    private scoreService: v1_api_score_Score_serviceServiceClientPb.ScoreServiceClient;
    private token: string;

    private sessionKey: string = 'oof_sdk_sessionId';
    private storageService: StorageService;
    private eventDispatcher: any;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.scoreService = new v1_api_score_Score_serviceServiceClientPb.ScoreServiceClient(this.baseUrl);
    }

    /**
    * Tries to retrieve the sessionId either from parameter or local storage.
    */
    private async getSessionId(sessionId?: string): Promise<string | null> {
        return sessionId ?? await this.storageService.getItem(this.sessionKey);
    }

    /**
     * Gets the player's score.
     */

    public async getScore(playerId: string, sessionId?: string): Promise<any> {
        const request = new v1_api_score_score_pb.PlayerScoresRequest();
        const currentSessionId = await this.getSessionId(sessionId);

        // Set the playerId in the request
        request.setPlayerId(playerId);

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
            this.scoreService.getPlayerScores(request, headers, (err: any, response: any) => {
                if (err) {
                    console.error('Error fetching score data:', err);
                    reject(err);
                } else {
                    resolve(response);
                }
            });
        });
    }

    /**
     * Submits a score for a player.
     */
    public async submitScore(playerId: string, score: number, sessionId?: string): Promise<any> {
        const request = new v1_api_score_score_pb.ScoreSubmission();
        const currentSessionId = await this.getSessionId(sessionId);

        // Set the playerId and score in the request
        request.setPlayerId(playerId);
        request.setValue(score);

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
            this.scoreService.submitScore(request, headers, (err: any, response: any) => {
                if (err) {
                    console.error('Error submitting score:', err);
                    reject(err);
                } else {
                    resolve(response);
                }
            });
        });
    }
}
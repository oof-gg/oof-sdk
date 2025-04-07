"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameAPI = void 0;
const protobuf_ts_web_1 = require("@oof.gg/protobuf-ts-web");
const StorageService_1 = require("../storage/StorageService");
class GameAPI {
    constructor(baseUrl, token) {
        this.sessionKey = 'oof_sdk_sessionId';
        this.token = token;
        this.baseUrl = baseUrl;
        this.gameService = new protobuf_ts_web_1.v1_api_game_Game_serviceServiceClientPb.GameServiceClient(this.baseUrl);
        this.storageService = new StorageService_1.StorageService();
    }
    /**
    * Tries to retrieve the sessionId either from parameter or local storage.
    */
    async getSessionId(sessionId) {
        return sessionId ?? await this.storageService.getItem(this.sessionKey);
    }
    // Sets the sessionId in local storage.
    async setSessionId(sessionId) {
        await this.storageService.setItem(this.sessionKey, sessionId);
    }
    async joinGame(userId, gameId, sessionId) {
        const request = new protobuf_ts_web_1.v1_api_game_join_leave_pb.JoinLeaveGame();
        const currentSessionId = await this.getSessionId(sessionId);
        // Set the userId and gameId in the request
        request.setUserId(userId);
        request.setGameId(gameId);
        request.setAction(protobuf_ts_web_1.v1_api_game_join_leave_pb.JoinLeaveGame.Action.JOIN);
        // If a session exists, attach it to the request if your protobuf definition supports it
        if (currentSessionId && typeof request.setSessionId === 'function') {
            console.log('[SDK] Setting sessionId:', currentSessionId);
            request.setSessionId(currentSessionId);
        }
        // Set Authorization header
        const headers = {
            'Authorization': `Bearer ${this.token}`,
        };
        return new Promise((resolve, reject) => {
            this.gameService.joinLeave(request, headers, (err, response) => {
                if (err) {
                    reject(new Error(err.message));
                }
                else {
                    resolve(response);
                }
            });
        });
    }
    async leaveGame(userId, gameId) {
        const request = new protobuf_ts_web_1.v1_api_game_join_leave_pb.JoinLeaveGame();
        request.setUserId(userId);
        request.setGameId(gameId);
        request.setAction(protobuf_ts_web_1.v1_api_game_join_leave_pb.JoinLeaveGame.Action.LEAVE);
        // Set Authorization header
        const headers = {
            'Authorization': `Bearer ${this.token}`,
        };
        return new Promise(async (resolve, reject) => {
            this.gameService.joinLeave(request, headers, (err, response) => {
                if (err) {
                    reject(new Error(err.message));
                }
                else {
                    resolve(response);
                }
            });
        });
    }
    handleResponse(response) {
        // Decode the response from the server
        const decodedResponse = protobuf_ts_web_1.v1_api_game_game_pb.StandardResponse.deserializeBinary(response.serializeBinary());
        return decodedResponse.toObject();
    }
}
exports.GameAPI = GameAPI;
exports.default = GameAPI;

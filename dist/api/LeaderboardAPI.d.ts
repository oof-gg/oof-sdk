import { Session } from '@oof.gg/protobuf-ts/dist/game/session';
export declare class LeaderboardAPI {
    private baseUrl;
    constructor(baseUrl: string);
    fetchLeaderboard(gameId: string): Promise<Session>;
}

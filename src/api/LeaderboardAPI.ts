import axios from 'axios';
import { Session } from '@oof.gg/protobuf-ts/dist/game/session';

export class LeaderboardAPI {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    public async fetchLeaderboard(gameId: string): Promise<Session> {
        const request = Session.create({ gameId });
        const encodedRequest = Session.encode(request).finish();

        const response = await axios.post(`${this.baseUrl}/leaderboard`, encodedRequest, {
            headers: { 'Content-Type': 'application/x-protobuf' }
        });

        return Session.decode(new Uint8Array(response.data));
    }
}

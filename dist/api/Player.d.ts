export default class PlayerAPI {
    private baseUrl;
    private playerService;
    private token;
    constructor(baseUrl: string, token: string);
    getPlayer(playerId?: string): Promise<any>;
}

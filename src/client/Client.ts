
import { GuildManager } from "../managers/GuildManager";
import { RequestHandler } from "../rest/RequestHandler";
import { WebsocketManager } from "../websocket/WebsocketManager";
import { BaseClient, ClientOptions } from "./BaseClient";

export class Client extends BaseClient {

    ws: WebsocketManager;

    guilds: GuildManager;

    token: string;

    requestHandler: RequestHandler;

    constructor(options: ClientOptions = {}) {
        super(Object.assign({ _tokenType: 'Bot' }, options));

        this.ws = new WebsocketManager(this);

        this.guilds = new GuildManager(this, undefined, { cache: options.guildCache });

        this.requestHandler = new RequestHandler(this);
    }

    async login(token: string): Promise<void> {
        this.token = token;
        await this.ws.connect();
        this.ws.sendIdentify(token);
    }
}
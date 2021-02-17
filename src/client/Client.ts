
import { ConcordiaClient } from "@developerdragon/concordiaclient";
import { GuildManager } from "../managers/GuildManager";
import { UserManager } from "../managers/UserManager";
import { RequestHandler } from "../rest/RequestHandler";
import { WebsocketManager } from "../websocket/WebsocketManager";
import { BaseClient, ClientOptions } from "./BaseClient";
import { ClientLogger } from "./ClientLogger";
import { ClientUser } from "./ClientUser";

export class Client extends BaseClient {

    ws: WebsocketManager;

    guilds: GuildManager;

    users: UserManager;

    requestHandler: RequestHandler;

    logger: ClientLogger;

    user: ClientUser;

    concordiaClient: ConcordiaClient;

    constructor(options: ClientOptions = {}) {
        super(Object.assign({ _tokenType: 'Bot' }, options));

        this.ws = new WebsocketManager(this);

        this.guilds = new GuildManager(this, undefined, { cache: options.guildCache });

        this.users = new UserManager(this, undefined, { cache: options.userCache });

        this.requestHandler = new RequestHandler(this);

        this.logger = new ClientLogger(this, this.options.debug);

        if (options.concordiaEnabled)
            this.concordiaClient = new ConcordiaClient({ host: options.concordiaHost, port: options.concordiaPort, token: options.concordiaToken });
    }

    async login(token?: string): Promise<void> {
        if (!this.options.token) this.options.token = token;
        await this.ws.connect();
        this.ws.sendIdentify(this.options.token);
    }
}

import { WebsocketManager } from "../websocket/WebsocketManager";
import { BaseClient, ClientOptions } from "./BaseClient";

export class Client extends BaseClient {

    ws: WebsocketManager;

    constructor(options: ClientOptions = {}) {
        super(Object.assign({ _tokenType: 'Bot' }, options));

        this.ws = new WebsocketManager(this);
    }

    async login(token: string): Promise<void> {
        await this.ws.connect();
        this.ws.sendIdentify(token);
    }
}
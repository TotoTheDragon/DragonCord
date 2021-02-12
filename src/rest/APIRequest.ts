import { Client } from "../client/Client";
import { Method } from "../util/Constants";

export class APIRequest {

    client: Client;

    method: Method;
    url: string;

    body: any;

    constructor(client: Client, method: Method, url: string) {
        this.client = client;
        this.method = method;
        this.url = url;
    }

    setBody(body: any): APIRequest {
        this.body = body;
        return this;
    }

    async make(): Promise<any> {
        return this.client.requestHandler.request(
            this.method,
            this.url,
            true,
            this.body,
            undefined
        );
    }


}
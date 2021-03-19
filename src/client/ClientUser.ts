import { User } from "../structure/user/User";
import { Snowflake } from "../util/Constants";
import { Client } from "./Client";

export class ClientUser extends User {

    id: Snowflake;
    username: string;
    discriminator: string;

    avatar: string;

    verified: boolean;


    constructor(client: Client, data: any) {
        super(client, data);
        this._update(data);
    }

    _update(data: any) {
        super._update(data);
        if ('verified' in data) this.verified = data.verified;
    }

}
import { Base } from "../structure/Base";
import { User } from "../structure/user/User";
import { CDNEndpoints, Snowflake, Urls } from "../util/Constants";
import { Util } from "../util/Util";
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

    avatarURL({ format = 'webp', size = undefined, dynamic = true } = {}): string {
        if (dynamic) format = this.avatar.startsWith('a_') ? 'gif' : format;
        return Util.makeImageUrl(
            Util.parseEndpoint(Urls.CDN + CDNEndpoints.USER_AVATAR, { user: this.id, avatar: this.avatar }), { format, size }
        )
    }


}
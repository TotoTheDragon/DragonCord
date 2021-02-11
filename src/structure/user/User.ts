import { Client } from "../../client/Client";
import { CDNEndpoints, Snowflake, Urls } from "../../util/Constants";
import { SnowflakeUtil } from "../../util/SnowflakeUtil";
import { Util } from "../../util/Util";
import { Base } from "../Base";

export class User extends Base {

    id: Snowflake;

    username: string;
    bot: boolean;
    discriminator: string;
    avatar: string;

    lastMessageID: Snowflake;
    lastMessageChannelID: Snowflake;

    system: boolean;
    flags: any;

    constructor(client: Client, data: any) {
        super(client);

        this.id = data.id;

        this.system = null;
        this.flags = null;

        this._deserialize(data);
    }

    _update(data: any) {

        this.username = 'username' in data ? data.username : null;
        this.bot = 'bot' in data ? Boolean(data.bot) : false;
        this.discriminator = 'discriminator' in data ? data.discriminator : null;
        this.avatar = 'avatar' in data ? data.avatar : null;

        this.system = 'system' in data ? Boolean(data.system) : false;
        this.flags = 'public_flags' in data ? data.public_flags : null;

        this.lastMessageID = null;
        this.lastMessageChannelID = null;
    }

    _deserialize(data: any) {
        this._update(data);
    }

    get partial() {
        return typeof this.username !== "string";
    }

    get createdTimestamp() {
        return SnowflakeUtil.deconstruct(this.id).timestamp;
    }

    get createdAt() {
        return new Date(this.createdTimestamp);
    }

    avatarURL({ format = 'webp', size = undefined, dynamic = true } = {}): string {
        if (dynamic) format = this.avatar.startsWith('a_') ? 'gif' : format;
        return Util.makeImageUrl(
            Util.parseEndpoint(Urls.CDN + CDNEndpoints.USER_AVATAR, { user: this.id, avatar: this.avatar }), { format, size }
        )
    }

    serialize(props?: string[]): object {
        return super.serialize([
            "username",
            "discriminator",
            "avatar",
            ...props
        ]
        )
    }

}
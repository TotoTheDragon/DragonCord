import { Client } from "../../client/Client";
import { CustomError } from "../../errors/CustomError";
import { requestBuilder } from "../../rest/RequestBuilder";
import { Snowflake, Urls } from "../../util/Constants";
import { Endpoints } from "../../util/Endpoints";
import { SnowflakeUtil } from "../../util/SnowflakeUtil";
import { Util } from "../../util/Util";
import { Base } from "../Base";
import { Message } from "../Message";
import { DMChannel } from "./DMChannel";

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

    private DMChannel: DMChannel;

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

    get channel() {
        if (this.DMChannel) return this.DMChannel;
        return null;
    }

    async createDM(): Promise<DMChannel> {
        if (!this.DMChannel) this.DMChannel = await new DMChannel(this.client, await requestBuilder(this.client)
            .users("@me")
            .channels()
            .post()
            .setBody({ recipient_id: this.id })
            .make(), this);
        return this.DMChannel;
    }

    async send(...content: any[]): Promise<Message> {
        if (!this.DMChannel) await this.createDM();
        if (!this.DMChannel) throw new CustomError("DM_CHANNEL_ERROR", "Was not able to create a DM Channel");
        return this.DMChannel.send(...content);
    }

    avatarURL({ format = 'webp', size = undefined, dynamic = true } = {}): string {
        if (dynamic) format = this.avatar.startsWith('a_') ? 'gif' : format;
        return Util.makeImageUrl(Urls.CDN + Endpoints.USER_AVATAR(this.id, this.avatar), { format, size })
    }

    serialize(props: string[] = []): object {
        return super.serialize([
            "username",
            "discriminator",
            "avatar",
            ...props
        ]
        )
    }

}
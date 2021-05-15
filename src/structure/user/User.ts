import { Client } from "../../client/Client";
import { CustomError } from "../../errors/CustomError";
import { Snowflake, Urls } from "../../util/Constants";
import { Endpoints } from "../../util/Endpoints";
import { SnowflakeUtil } from "../../util/SnowflakeUtil";
import { Util } from "../../util/Util";
import { Base } from "../Base";
import { Message } from "../Message";
import { FetchOptions, Partial } from "../Partial";
import { PrivateChannel } from "./PrivateChannel";

export class User extends Base implements Partial {

    id: Snowflake;

    username: string;
    bot: boolean;
    discriminator: string;
    avatar: string;

    lastMessageID: Snowflake;
    lastMessageChannelID: Snowflake;

    system: boolean;
    flags: any;

    channelID: Snowflake;

    private DMChannel: PrivateChannel;

    constructor(client: Client, data: any) {
        super(client);

        this.id = data.id;

        this.system = null;
        this.flags = null;

        this._deserialize(data);
    }

    async fetch(opts?: FetchOptions): Promise<User> {
        const userData = await this._client.getRESTUser(this.id);
        if (opts?.cache === false)
            return this._clone()._deserialize(userData);
        else
            this._deserialize(userData);
        return this;
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
        return this._client.privateChannels.get(this.channelID, this.id);
    }

    async createDM(): Promise<PrivateChannel> {
        if (!this.channelID)
            this.channelID = (await this._client.getDMChannel(this.id)).id;
        return this.channel;
    }

    async send(...content: any[]): Promise<Message[]> {
        if (!this.DMChannel) await this.createDM();
        if (!this.DMChannel) throw new CustomError("DM_CHANNEL_ERROR", "Was not able to create a DM Channel");
        return this.DMChannel.sendItems(...content);
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
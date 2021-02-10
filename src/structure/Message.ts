import { Client } from "../client/Client";
import { Collection } from "../util/Collection";
import { MessageReference, MessageTypes, Snowflake } from "../util/Constants";
import { SnowflakeUtil } from "../util/SnowflakeUtil";
import { Base } from "./Base";

export class Message extends Base {

    id: string; // The snowflake of this message

    channelID: Snowflake; // The snowflake of the channel this message was sent in
    guildID?: Snowflake; // The snowflake of the guild this message was sent in
    webhookID?: Snowflake; // The snowflake of the webhook this message was sent by

    author: Base; // User object of the author
    member: Base; // GuildMember object of the author

    type: MessageTypes;
    system: boolean;

    content: string;
    embeds: any[];
    attachments: Collection<string, any>;
    reactions: Collection<string, any>;

    reference: MessageReference;

    editedTimestamp?: number;

    pinned: boolean;
    tts: boolean;

    nonce: string;

    deleted: boolean;

    constructor(client: Client, data: any) {
        super(client);

        this.channelID = data.channel_id;
        this.guildID = data.guild_id;

        this.deleted = false;

        if (data) this._deserialize(data);
    }

    get createdAt() {
        return new Date(SnowflakeUtil.deconstruct(this.id).timestamp);
    }

    get editedAt() {
        return this.editedTimestamp ? new Date(this.editedTimestamp) : null;
    }

    get isDM(): boolean {
        return this.guildID === undefined;
    }

    get isGuild(): boolean {
        return !this.isDM;
    }

    get guild(): Base {
        return this.isGuild ? new Base(this.client) : null; // TODO Change this to lookup guild in cache
    }

    get partial(): boolean {
        return typeof this.content !== 'string' || !this.author;
    }

    _deserialize(data: any) {

        this.id = data.id;

        if ('type' in data) {
            this.type = data.type;
            this.system = this.type !== MessageTypes.DEFAULT && this.type !== MessageTypes.REPLY;
        } else if (typeof this.type !== "number") {
            this.type = null;
            this.system = null;
        }

        if ('content' in data) this.content = data.content;
        else if (typeof this.content !== 'string') this.content = null;


        if ('author' in data) this.author = data.author; // TODO Change this to make an user object (get it from cache. Update/add it first)
        else if (!this.author) this.author = null;


        if ('pinned' in data) this.pinned = Boolean(data.pinned);
        else if (typeof this.pinned !== "boolean") this.pinned = null;

        if ('tts' in data) this.tts = data.tts;
        else if (typeof this.tts !== 'boolean') this.tts = null;

        this.nonce = 'nonce' in data ? data.nonce : null;

        this.embeds = data.embeds || []; // TODO Change this to turn into embed objects

        this.attachments = new Collection();
        if (data.attachments && data.attachments.length > 0)
            for (const attachment of data.attachment)
                this.attachments.set(attachment.id, attachment);

        if (data.reactions && data.reactions.length > 0)
            for (const reaction of data.reactions)
                this.reactions.set(reaction.emoji.id, reaction);

        // TODO Add support for mentions
        this.webhookID = data.webhook_id || null;

        if (this.member && data.member)
            this.member._deserialize(data.member);
        else if (data.member && this.guild && this.author)
            this.member = new Base(this.client);

        this.reference = data.message_reference ? { channelID: data.message_reference.channel_id, guildID: data.message_reference.guild_id, messageID: data.message_reference.message_id } : null;

    }

    _update(data: any) {
        const clone: Message = this._clone();

        if ('edited_timestamp' in data) this.editedTimestamp = new Date(data.edited_timestamp).getTime();
        if ('content' in data) this.content = data.content;
        if ('pinned' in data) this.pinned = data.pinned;
        if ('tts' in data) this.tts = data.tts;
        if ('embeds' in data) this.embeds = data.embeds;
        else this.embeds = this.embeds.slice();

        if ('attachments' in data) {
            this.attachments = new Collection();
            for (const attachment of data.attachments)
                this.attachments.set(attachment.id, attachment);
        }

        return clone;
    }

}
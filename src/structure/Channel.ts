import { Client } from "../client/Client";
import { ChannelType, Snowflake } from "../util/Constants";
import { SnowflakeUtil } from "../util/SnowflakeUtil";
import { Base } from "./Base";
import { TextBasedChannel } from "./interfaces/TextBasedChannel";

export class Channel extends Base {

    id: Snowflake;

    type: ChannelType;

    deleted: boolean;

    constructor(client: Client, data: any) {
        super(client);

        this.type = data.type ?? 0;

        this.deleted = false;

        if (data != null) this._deserialize(data);

        if (this.isTextBased && !(this instanceof TextBasedChannel)) Object.setPrototypeOf(this, TextBasedChannel.prototype);
    }

    get createdTimestamp(): number {
        return SnowflakeUtil.deconstruct(this.id).timestamp;
    }

    get createdAt(): Date {
        return new Date(this.createdTimestamp);
    }

    get mention(): string {
        return `<#${this.id}>`;
    }

    get isTextBased(): boolean {
        return this.type === ChannelType.TEXT
            || this.type === ChannelType.DM;
    }

    _deserialize(data: any) {
        if ('id' in data)
            this.id = data.id;
        super._deserialize(data);
    }

    serialize(props: string[] = []): object {
        return super.serialize([
            "createdTimestamp",
            ...props
        ])
    }

    async fetch(): Promise<Channel> {
        const data = await this._client.getRESTChannel(this.id);
        this._deserialize(data);
        return this;
    }

}
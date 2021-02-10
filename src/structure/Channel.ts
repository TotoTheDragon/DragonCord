import { Client } from "../client/Client";
import { ChannelTypes, Snowflake } from "../util/Constants";
import { SnowflakeUtil } from "../util/SnowflakeUtil";
import { Base } from "./Base";

export class Channel extends Base {

    id: Snowflake;

    type: string;

    deleted: boolean;

    constructor(client: Client, data: any) {
        super(client);

        const type = ChannelTypes[data.type];

        this.type = type ? type.toLowerCase() : 'unknown';

        this.deleted = false;

        if (data) this._deserialize(data);
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

    get isText(): boolean {
        return 'messages' in this;
    }

    _deserialize(data: any) {
        this.id = data.id;
    }

    serialize(props: string[] = []): object {
        return super.serialize([
            "createdTimestamp",
            ...props
        ])
    }

}
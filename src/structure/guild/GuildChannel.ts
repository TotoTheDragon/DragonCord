import { Client } from "../../client/Client";
import { Snowflake } from "../../util/Constants";
import { TextBasedChannel } from "../interfaces/TextBasedChannel";

export class GuildChannel extends TextBasedChannel {

    guildID: Snowflake;

    name: string;
    position: number;
    categoryID: Snowflake;

    deleted: boolean;

    constructor(client: Client, data: any) {
        super(client, data);

        this.deleted = false;

    }

    get guild() {
        return this._client.guilds.get(this.guildID);
    }

    get category() {
        return this._client.channels.get(this.categoryID);
    }

    _deserialize(data: any) {
        super._deserialize(data);

        this.guildID = data.guild_id;

        this._update(data);
    }

    _update(data: any) {
        if ('name' in data)
            this.name = data.name;

        if ('position' in data)
            this.position = data.position;

        if ('parent_id' in data)
            this.categoryID = data.parent_id;

        if ('deleted' in data)
            this.deleted = data.deleted;
    }

    serialize(props: string[] = []): object {
        return super.serialize([
            "name",
            "categoryID",
            "deleted",
            ...props
        ])
    }
}
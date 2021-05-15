import { Client } from "../../client/Client";
import { Snowflake } from "../../util/Constants";
import { TextBasedChannel } from "../interfaces/TextBasedChannel";

export class GuildChannel extends TextBasedChannel {

    guildID: Snowflake;

    name: string;
    position: number;
    categoryID: Snowflake;

    constructor(client: Client, data: any) {
        super(client, data);
    }

    get guild() {
        return this._client.guilds.resolve(this.guildID);
    }

    get category() {
        return this._client.channels.resolve(this.categoryID);
    }

    _deserialize(data: any) {
        super._deserialize(data);

        this.guildID = data.guild_id;

        this.name = data.name;
        this.position = data.position;
        this.categoryID = data.parent_id || null;
    }

    _update(data: any) {

        if ('name' in data)
            this.name = data.name;
        if ('position' in data)
            this.position = data.position;
        if ('parent_id' in data)
            this.categoryID = data.parent_id;
    }

    serialize(props: string[] = []): object {
        return super.serialize([
            "name",
            "categoryID",
            ...props
        ])
    }
}
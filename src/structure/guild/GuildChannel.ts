import { Client } from "../../client/Client";
import { Snowflake } from "../../util/Constants";
import { Channel } from "../Channel";
import { Guild } from "./Guild";

export class GuildChannel extends Channel {

    guild: Guild;

    name: string;
    position: number;
    categoryID: Snowflake;

    constructor(client: Client, data: any) {
        super(client, data);

        this.guild = client.guilds.resolve(data.guild_id);
    }

    get category() {
        return null; // TODO Get the category channel from guild
    }

    _deserialize(data: any) {
        super._deserialize(data);

        this.name = data.name;
        this.position = data.position;
        this.categoryID = data.parent_id || null;
    }
}
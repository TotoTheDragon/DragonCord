import { Client } from "../client/Client";
import { Guild } from "../structure/guild/Guild";
import { GuildChannel } from "../structure/guild/GuildChannel";
import { ManagerOptions, Snowflake } from "../util/Constants";
import { BaseManager } from "./BaseManager";

export class GuildChannelManager extends BaseManager<Snowflake, GuildChannel> {

    guild: Guild;

    constructor(guild: Guild, client: Client, iterable?: Iterable<GuildChannel>, options?: ManagerOptions) {
        super(client, GuildChannel, iterable, options);
        this.guild = guild;
    }

}
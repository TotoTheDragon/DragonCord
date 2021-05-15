import { Client } from "../client/Client";
import { Guild } from "../structure/guild/Guild";
import { GuildChannel } from "../structure/guild/GuildChannel";
import { Partial, PartialCreateOptions, PartialManager } from "../structure/Partial";
import { ManagerOptions, Snowflake } from "../util/Constants";
import { BaseManager } from "./BaseManager";

export class GuildChannelManager extends BaseManager<GuildChannel> implements PartialManager {

    guild: Guild;

    constructor(guild: Guild, client: Client, options?: ManagerOptions) {
        super(client, GuildChannel, options, client.channels.getChannels(guild.id));
        this.guild = guild;
    }

    get(id: string, opts?: PartialCreateOptions): Partial {
        return this._cache.get(id) as GuildChannel || this.createPartial(id, opts);
    }

    createPartial(id: string, opts?: PartialCreateOptions, data?: any): Partial {
        return this._client.channels.createPartial(id, opts, data);
    }

    add(channel: GuildChannel): GuildChannel {
        if (this._cache.has(channel.id))
            return this.resolve(channel.id);
        this._cache.add(channel.id, channel);
        return channel;
    }

    remove(channelID: Snowflake) {
        this._cache.remove(channelID);
    }

}
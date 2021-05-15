import { Client } from "../client/Client";
import { GuildChannel } from "../structure/guild/GuildChannel";
import { PartialCreateOptions, PartialManager } from "../structure/Partial";
import { ManagerOptions, Snowflake } from "../util/Constants";
import { BaseManager } from "./BaseManager";

export class ChannelManager extends BaseManager<GuildChannel> implements PartialManager {

    guildChannels: Map<Snowflake, Set<Snowflake>>; // Guild, Channel[]

    constructor(client: Client, options?: ManagerOptions) {
        super(client, GuildChannel, options);
        this.guildChannels = new Map();
    }

    get(id: string, opts?: PartialCreateOptions): GuildChannel {
        return this._cache.get(id) as GuildChannel || this.createPartial(id, opts);
    }

    createPartial(id: string, opts?: PartialCreateOptions, data?: any): GuildChannel {
        return this.add({ ...data, id }, opts?.cache);
    }

    onAdd(channel: GuildChannel) {
        // Add to guildChannel map
        if (!this.guildChannels.has(channel.guildID)) this.guildChannels.set(channel.guildID, new Set());
        this.guildChannels.get(channel.guildID).add(channel.id);

        // Add to guilds channel manager
        this._client.guilds.resolve(channel.guildID).channels.add(channel);
    }

    getChannels(guild: Snowflake): GuildChannel[] {
        return Array.from(this.guildChannels.get(guild) ?? [], id => this.resolve(id));
    }

    remove(channelID: Snowflake) {
        const channel = this.resolve(channelID);
        channel?.guild?.channels?.remove(channelID);
        this.guildChannels.get(channel?.guildID)?.delete(channelID);
        this._cache.remove(channelID);
    }

}
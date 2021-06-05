import { Client } from "../client/Client";
import { Guild } from "../structure/guild/Guild";
import { GuildMember } from "../structure/guild/GuildMember";
import { Partial, PartialCreateOptions, PartialManager } from "../structure/Partial";
import { ManagerOptions } from "../util/Constants";
import { BaseManager } from "./BaseManager";

export class GuildMemberManager extends BaseManager<GuildMember> implements PartialManager {

    private readonly guild: Guild;

    constructor(guild: Guild, client: Client, options?: ManagerOptions) {
        super(client, GuildMember, options);
        this.guild = guild;
    }

    get cache() {
        return this._cache;
    }

    get(id: string, opts?: PartialCreateOptions): GuildMember {
        return this._cache.get(id) as GuildMember || this.createPartial(id, opts);
    }

    createPartial(id: string, opts?: PartialCreateOptions, data?: any): GuildMember {
        return this.add({ user: { id } })
    }

    add(data: any, cache: boolean = true, ...extras: any[]): GuildMember {
        return super.add({ ...data }, cache, this.guild, ...extras);
    }

    async fetch(): Promise<GuildMember[]> {
        const guildMembers = await this._client.getRESTGuildMembers(this.guild.id);
        return guildMembers.map(data => this.add(data));
    }

}
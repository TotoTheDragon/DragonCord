import { Client } from "../client/Client";
import { Guild } from "../structure/guild/Guild";
import { PartialCreateOptions, PartialManager } from "../structure/Partial";
import { Role } from "../structure/Role";
import { ManagerOptions } from "../util/Constants";
import { BaseManager } from "./BaseManager";

export class GuildRoleManager extends BaseManager<Role> implements PartialManager {

    private readonly guild: Guild;

    constructor(guild: Guild, client: Client, options?: ManagerOptions) {
        super(client, Role, options);
        this.guild = guild;
    }

    get cache() {
        return this._cache;
    }

    get(id: string, opts?: PartialCreateOptions): Role {
        return this._cache.get(id) as Role || this.createPartial(id, opts);
    }

    createPartial(id: string, opts?: PartialCreateOptions, data?: any): Role {
        return this.add({ id })
    }

    add(data: any, cache: boolean = true, ...extras: any[]): Role {
        return super.add({ ...data }, cache, this.guild, ...extras);
    }

    async fetch(): Promise<Role[]> {
        const roles = await this._client.getRESTGuildRoles(this.guild.id);
        this.guild._roles = roles.map(role => role.id);
        return roles.map(data => this.add(data));
    }

}
import { Client } from "../client/Client";
import { Guild } from "../structure/guild/Guild";
import { PartialCreateOptions, PartialManager } from "../structure/Partial";
import { ManagerOptions, Snowflake } from "../util/Constants";
import { BaseManager } from "./BaseManager";

export class GuildManager extends BaseManager<Guild> implements PartialManager {

    constructor(client: Client, options?: ManagerOptions) {
        super(client, Guild, options);
    }

    get cache() {
        return this._cache;
    }

    get(id: Snowflake, opts?: PartialCreateOptions): Guild {
        return this._cache.get(id) as Guild || this.createPartial(id, opts);
    }

    createPartial(id: Snowflake, opts?: PartialCreateOptions): Guild {
        return this.add({ id }, opts?.cache);
    }

}
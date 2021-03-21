import { Client } from "../client/Client";
import { Guild } from "../structure/guild/Guild";
import { ManagerOptions } from "../util/Constants";
import { BaseManager } from "./BaseManager";

export class GuildManager extends BaseManager<Guild> {

    constructor(client: Client, iterable?: Iterable<Guild>, options?: ManagerOptions) {
        super(client, Guild, iterable, options);
    }

}
import { Client } from "../client/Client";
import { PrivateChannel } from "../structure/user/PrivateChannel";
import { ManagerOptions, Snowflake } from "../util/Constants";
import { BaseManager } from "./BaseManager";

export class PrivateChannelManager extends BaseManager<PrivateChannel> {

    userMap: Map<Snowflake, Snowflake>;

    constructor(client: Client, options?: ManagerOptions) {
        super(client, PrivateChannel, options);
        this.userMap = new Map();
    }

    onAdd(data: any) {
        if (!data.id || !data.recipients?.length) return;
        this.userMap.set(data.recipients[0].id, data.id);
    }

    get(id: Snowflake, user?: Snowflake): PrivateChannel {
        return this._cache.get(id ?? this.userMap.get(user)) as PrivateChannel
            ?? this.add({ id: id ?? this.userMap.get(user) }, true, user);
    }

    getUserChannel(user: Snowflake): PrivateChannel {
        return this.get(this.userMap.get(user), user);
    }

}
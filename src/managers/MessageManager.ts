import { Client } from "../client/Client";
import { Message } from "../structure/Message";
import { PartialCreateOptions, PartialManager } from "../structure/Partial";
import { User } from "../structure/user/User";
import { ManagerOptions } from "../util/Constants";
import { BaseManager } from "./BaseManager";

export class MessageManager extends BaseManager<Message> implements PartialManager {

    constructor(client: Client, options?: ManagerOptions) {
        super(client, User, options);
    }

    get(id: string, opts?: PartialCreateOptions): Message {
        return this._cache.get(id) as Message || this.createPartial(id, opts);
    }

    createPartial(id: string, opts?: PartialCreateOptions, data?: any): Message {
        return this.add({ ...data, id }, opts?.cache);
    }

}
import { Client } from "../client/Client";
import { PartialCreateOptions, PartialManager } from "../structure/Partial";
import { User } from "../structure/user/User";
import { ManagerOptions } from "../util/Constants";
import { BaseManager } from "./BaseManager";

export class UserManager extends BaseManager<User> implements PartialManager {

    constructor(client: Client, options?: ManagerOptions) {
        super(client, User, options);
    }

    get(id: string, opts?: PartialCreateOptions): User {
        return this._cache.get(id) as User || this.createPartial(id, opts);
    }

    createPartial(id: string, opts?: PartialCreateOptions, data?: any): User {
        return this.add({ ...data, id }, opts?.cache);
    }

}
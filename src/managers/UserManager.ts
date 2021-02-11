import { Client } from "../client/Client";
import { User } from "../structure/user/User";
import { ManagerOptions, Snowflake } from "../util/Constants";
import { BaseManager } from "./BaseManager";

export class UserManager extends BaseManager<Snowflake, User> {

    constructor(client: Client, iterable?: Iterable<User>, options?: ManagerOptions) {
        super(client, User, iterable, options);
    }

}
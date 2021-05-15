import { Client } from "../client/Client";
import { User } from "../structure/user/User";
import { ManagerOptions } from "../util/Constants";
import { BaseManager } from "./BaseManager";

export class UserManager extends BaseManager<User> {

    constructor(client: Client, options?: ManagerOptions) {
        super(client, User, options);
    }

}
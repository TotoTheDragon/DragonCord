import { Client } from "../client/Client";
import { Base } from "./Base";
import { Permission } from "../util/Constants";
export class Permissions extends Base {

    _allow: bigint;
    _deny: bigint;

    constructor(client: Client, allow: bigint, deny: bigint = 0n) {
        super(client);
        this._allow = allow;
        this._deny = deny
    }

    has(permission: string | bigint | number): boolean {
        const num = BigInt(typeof permission === "string" ? Permission[permission] : permission);
        return Boolean(this._allow & num);
    }

    allow(permission: string | bigint | number): bigint {
        const num: bigint = BigInt(typeof permission === "string" ? Permission[permission] : permission);
        this._deny = this._deny & ~num;
        return this._allow = this._allow | num;
    }

    deny(permission: string | bigint | number): bigint {
        const num: bigint = BigInt(typeof permission === "string" ? Permission[permission] : permission);
        this._allow = this._allow & ~num;
        return this._deny = this._deny | num;
    }

    serialize(props: string[] = []) {
        return super.serialize([
            "allow",
            "deny",
            ...props
        ])
    }
}
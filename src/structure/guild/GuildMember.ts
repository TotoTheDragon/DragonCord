import { Client } from "../../client/Client";
import { Snowflake } from "../../util/Constants";
import { Base } from "../Base";
import { FetchOptions, Partial } from "../Partial";
import { User } from "../user/User";

export class GuildMember extends Base implements Partial {

    id: Snowflake;
    guildID: Snowflake;
    user: User;
    _roles: Snowflake[];

    constructor(client: Client, data: any) {
        super(client);

        this._roles = [];

        if (data) this._deserialize(data);
    }

    private _joined_at;

    get partial(): boolean {
        return Boolean(this._joined_at);
    }

    async fetch(opts?: FetchOptions): Promise<GuildMember> {
        const guildData = await this._client.getRESTGuildMember(this.guildID, this.id);
        if (opts?.cache === false)
            return this._clone()._deserialize(guildData);
        else
            this._deserialize(guildData);
        return this;
    }

}
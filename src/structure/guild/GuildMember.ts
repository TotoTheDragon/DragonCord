import { Client } from "../../client/Client";
import { Snowflake } from "../../util/Constants";
import { Base } from "../Base";
import { FetchOptions, Partial } from "../Partial";
import { User } from "../user/User";
import { Guild } from "./Guild";

export class GuildMember extends Base implements Partial {

    id: Snowflake;
    guildID: Snowflake;

    guild: Guild;

    nick: string;
    avatar: string;

    deaf: boolean;
    mute: boolean;

    pending: boolean;

    private _premium_since: number;
    private _joined_at: number;

    user: User;

    private _roles: Snowflake[];

    constructor(client: Client, data: any, guild: Guild) {
        super(client);

        this._roles = [];

        this.guild = guild;
        this.guildID = guild.id;

        if (data) this._deserialize(data);
    }

    get isOwner(): boolean {
        return this.id === this.guild.ownerID;
    }

    get premiumSince(): Date {
        return new Date(this._premium_since);
    }

    get joinedAt(): Date {
        return new Date(this._joined_at);
    }

    get partial(): boolean {
        return Boolean(this._joined_at);
    }

    async fetch(opts?: FetchOptions): Promise<GuildMember> {
        const guildData = await this._client.getRESTGuildMember(this.guildID, this.id);
        if (opts?.cache === false)
            return this._clone()._update(guildData);
        else
            this._update(guildData);
        return this;
    }

    _deserialize(data: any) {
        this.id = data.user.id;

        this._update(data);
    }

    _update(data: any) {
        this._roles = data.roles;

        console.log(data.joined_at)
        console.log(new Date(data.joined_at).getMilliseconds());
        this._joined_at = new Date(data.joined_at).getMilliseconds();

        this.deaf = data.deaf;
        this.mute = data.mute;

        if ('user' in data)
            this.user = this._client.users.add(data.user);

        if ('premium_since' in data)
            this._premium_since = data.premium_since != null ? new Date(data.premium_since).getMilliseconds() : null;

        if ('nick' in data)
            this.nick = data.nick;

        if ('avatar' in data)
            this.avatar = data.avatar;

        if ('pending' in data)
            this.pending = data.pending;
    }

    serialize(props: string[] = []) {
        return super.serialize([
            ...props,
            "user",
            "nick",
            "joinedAt"
        ]);
    }
}
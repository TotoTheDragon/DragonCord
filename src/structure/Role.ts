import { Client } from "../client/Client";
import { Snowflake } from "../util/Constants";
import { Base } from "./Base";
import { Guild } from "./guild/Guild";
import { FetchOptions, Partial } from "./Partial";

export class Role extends Base implements Partial {

    id: Snowflake;
    name: string;

    guild: Guild;

    position: number;
    hoisted: boolean
    managed: boolean;
    mentionable: boolean;

    _color: number;
    _permissions: string;

    tags: RoleTags;

    constructor(client: Client, data: any, guild: Guild) {
        super(client);
        this.guild = guild;
        this.tags = {};
        this._deserialize(data);
    }

    get partial(): boolean {
        return this.name == null;
    }

    async fetch(opts?: FetchOptions): Promise<Role> {
        const data = await this._client.getRESTGuildRole(this.guild.id, this.id);
        this._update(data);
        return this;
    }

    _deserialize(data: any) {
        this.id = data.id;
        this.managed = data.managed;

        if ('tags' in data) {
            this.tags.botID = data.tags.bot_id;
            this.tags.integrationID = data.tags.integration_id;
            this.tags.premium = data.tags.premium_subscriber;
        }

        this._update(data);
    }

    _update(data: any) {
        this.name = data.name;
        this._color = data.color;
        this.hoisted = data.hoist;
        this.position = data.position;
        this._permissions = data.permissions;
        this.managed = data.managed;
        this.mentionable = data.mentionable;
    }
}

export interface RoleTags {
    botID?: Snowflake,
    integrationID?: Snowflake,
    premium?: boolean
}
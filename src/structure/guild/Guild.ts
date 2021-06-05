import { Client } from "../../client/Client";
import { GuildChannelManager } from "../../managers/GuildChannelManager";
import { GuildMemberManager } from "../../managers/GuildMemberManager";
import { GuildRoleManager } from "../../managers/GuildRoleManager";
import { Snowflake } from "../../util/Constants";
import { SnowflakeUtil } from "../../util/SnowflakeUtil";
import { Base } from "../Base";
import { FetchOptions, Partial } from "../Partial";

export class Guild extends Base implements Partial {

    channels: GuildChannelManager;
    members: GuildMemberManager;
    roles: GuildRoleManager;

    id: Snowflake;

    name: string;
    icon: string;
    splash: string;
    discoverySplash: string;
    region: string;
    description: string;
    banner: string;

    ownerID: Snowflake;

    vanityURLCode: string;
    vanityURLUses: number;

    memberCount: number;
    large: boolean;

    joinedTimestamp: number;

    features: any[]; // TODO Add interface for features

    premiumTier: number; // TODO Add Enum for tiers
    premiumSubscriptionCount: number;

    afkTimeout: number;
    afkChannelID: Snowflake;
    systemChannelID: Snowflake;

    applicationID: Snowflake;

    widgetEnabled: boolean;
    widgetChannelID: Snowflake;
    embedEnabled: boolean;
    embedChannelID: Snowflake;

    deleted: boolean;
    available: boolean;

    shardID: number;

    _roles: any[];

    constructor(client: Client, data: any) {
        super(client);

        this.channels = new GuildChannelManager(this, client);
        this.members = new GuildMemberManager(this, client);
        this.roles = new GuildRoleManager(this, client)
        this.deleted = false;

        if (!data) return;
        if (data.unavailable) {
            this.available = false;
            this.id = data.id;
        } else {
            this._deserialize(data);
            if (!data.channels) this.available = false;
        }

        this.shardID = data.shardID || SnowflakeUtil.findShard(this.id, this._client.options.shardCount || 1);
    }

    get createdTimestamp() {
        return SnowflakeUtil.deconstruct(this.id).timestamp;
    }

    get createdAt() {
        return new Date(this.createdTimestamp);
    }

    get joinedAt() {
        return new Date(this.joinedTimestamp);
    }

    iconURL(): string {
        return ""
    }

    splashURL(): string {
        return ""
    }

    discoverySplashURL(): string {
        return "";
    }

    bannerURL(): string {
        return "";
    }

    async fetch(opts?: FetchOptions): Promise<Guild> {
        const guildData = await this._client.getRESTGuild(this.id);
        if (opts?.cache === false)
            return this._clone()._deserialize(guildData);
        else
            this._deserialize(guildData);
        return this;
    }

    get partial(): boolean {
        return Boolean(this.name);
    }

    _deserialize(data: any) {

        this._roles = data.roles;

        this.id = data.id;
        this.available = !data.unavailable;

        this.joinedTimestamp = data.joined_at ? new Date(data.joined_at).getTime() : this.joinedTimestamp;

        this._update(data);

        return this;
    }

    _update(data: any) {

        if ('name' in data)
            this.name = data.name;
        if ('icon' in data)
            this.icon = data.icon;
        if ('splash' in data)
            this.splash = data.splash;
        if ('discoverySplash' in data)
            this.discoverySplash = data.discoverySplash;
        if ('region' in data)
            this.region = data.region;
        if ('description' in data)
            this.description = data.description;

        if ('vanity_url_code' in data)
            this.vanityURLCode = data.vanity_url_code;
        this.vanityURLUses = null;

        if ('member_count' in data)
            this.memberCount = data.member_count ?? 0;

        this.large = Boolean('large' in data ? data.large : this.large);

        if ('features' in data)
            this.features = data.features;

        if ('premium_tier' in data)
            this.premiumTier = data.premium_tier;

        if ("afk_timeout" in data)
            this.afkTimeout = data.afk_timeout;
        if ('afk_channel_id' in data)
            this.afkChannelID = data.afk_channel_id;
        if ('system_channel_id' in data)
            this.systemChannelID = data.system_channel_id;

        if (typeof data.premium_subscription_count !== "undefined")
            this.premiumSubscriptionCount = data.premium_subscription_count;

        if (typeof data.widget_enabled !== "undefined")
            this.widgetEnabled = data.widget_enabled;
        if (typeof data.widget_channel_id !== 'undefined')
            this.widgetChannelID = data.widget_channel_id;

        if (typeof data.embed_enabled !== "undefined")
            this.embedEnabled = data.embed_enabled;
        if (typeof data.embed_channel_id !== 'undefined')
            this.embedChannelID = data.embed_channel_id;

        if (data.owner_id)
            this.ownerID = data.owner_id;

        if ('roles' in data)
            this._roles = data.roles;

        this._roles.forEach(data => this.roles.add(data, undefined, this));
    }

    serialize(props: string[] = []): object {
        return super.serialize([
            "name",
            "description",
            "available",
            ...props
        ]
        )
    }
}
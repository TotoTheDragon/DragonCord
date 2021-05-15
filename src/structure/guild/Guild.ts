import { Client } from "../../client/Client";
import { GuildChannelManager } from "../../managers/GuildChannelManager";
import { Snowflake } from "../../util/Constants";
import { SnowflakeUtil } from "../../util/SnowflakeUtil";
import { Base } from "../Base";
import { FetchOptions, Partial } from "../Partial";

export class Guild extends Base implements Partial {

    channels: GuildChannelManager;

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

    constructor(client: Client, data: any) {
        super(client);

        this.channels = new GuildChannelManager(this, client, { cache: true });

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

    _deserialize(data: any) {

        this.id = data.id;
        this.available = !data.unavailable;

        this.name = data.name;
        this.icon = data.icon;
        this.splash = data.splash;
        this.discoverySplash = data.discoverySplash;
        this.region = data.region;
        this.description = data.description;

        this.vanityURLCode = data.vanity_url_code;
        this.vanityURLUses = null;

        this.memberCount = data.member_count || this.memberCount;
        this.large = Boolean('large' in data ? data.large : this.large);

        this.features = data.features;

        this.premiumTier = data.premium_tier;

        this.afkTimeout = data.afk_timeout;
        this.afkChannelID = data.afk_channel_id;
        this.systemChannelID = data.system_channel_id;

        this.joinedTimestamp = data.joined_at ? new Date(data.joined_at).getTime() : this.joinedTimestamp;

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

        return this;
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
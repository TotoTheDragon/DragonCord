import { ClientOptions } from "../client/BaseClient";
import { config } from "dotenv";

config({ path: "../.env" });

/*
    Constant values
*/

export const DefaultOptions: ClientOptions = {
    token: process.env.DISCORD_TOKEN || undefined,
    shard: 0,
    shardCount: 1,
    messageCacheMaxSize: 200,
    messageCacheLifetime: 0,
    messageSweepInterval: 0,
    restWsBridgeTimeout: 5000,
    restRequestTimeout: 15000,
    retryLimit: 1,
    restTimeOffset: 500,
    restSweepInterval: 60,
    debug: false
}

export const DefaultManagerOptions: ManagerOptions = {
    cache: true,
}

export const REST_VERSION = 8;

export const ImageFormats = ["webp", "png", "jpg", "jpeg", "gif"];

export const ImageSizes = Array.from({ length: 9 }, (e, i) => 2 ** (i + 4));

/*
    Enums
*/

export enum Urls {
    Base = "/api/v",
    CDN = "https://cdn.discordapp.com",
    Client = "discord.com"
}

export enum Endpoints {
    CHANNEL = `/channels/:channel`,
    CHANNEL_BULK_DELETE = `/channels/:channel/messages/bulk-delete`,
    CHANNEL_CALL_RING = `/channels/:channel/call/ring`,
    CHANNEL_CROSSPOST = `/channels/:channel/messages/:message/crosspost`,
    CHANNEL_FOLLOW = `/channels/:channel/followers`,
    CHANNEL_INVITES = `/channels/:channel/invites`,
    CHANNEL_MESSAGE_REACTION = `/channels/:channel/messages/:message/reactions/:reaction`,
    CHANNEL_MESSAGE_REACTION_USER = `/channels/:channel/messages/:message/reactions/:reaction/:user`,
    CHANNEL_MESSAGE_REACTIONS = `/channels/:channel/messages/:message/reactions`,
    CHANNEL_MESSAGE = `/channels/:channel/messages/:message`,
    CHANNEL_MESSAGES = `/channels/:channel/messages`,
    CHANNEL_MESSAGES_SEARCH = `/channels/:channel/messages/search`,
    CHANNEL_PERMISSION = `/channels/:channel/permissions/:ovveride`,
    CHANNEL_PERMISSIONS = `/channels/:channel/permissions`,
    CHANNEL_PIN = `/channels/:channel/pins/:message`,
    CHANNEL_PINS = `/channels/:channel/pins`,
    CHANNEL_RECIPIENT = `/channels/:group/recipients/:user`,
    CHANNEL_TYPING = `/channels/:channel/typing`,
    CHANNEL_WEBHOOKS = `/channels/:channel/webhooks`,
    CHANNELS = "/channels",
    GATEWAY = "/gateway",
    GATEWAY_BOT = "/gateway/bot",
    GUILD = `/guilds/:guild`,
    GUILD_AUDIT_LOGS = `/guilds/:guild/audit-logs`,
    GUILD_BAN = `/guilds/:guild/bans/:member`,
    GUILD_BANS = `/guilds/:guild/bans`,
    GUILD_CHANNELS = `/guilds/:guild/channels`,
    GUILD_EMBED = `/guilds/:guild/embed`,
    GUILD_EMOJI = `/guilds/:guild/emojis/:emoji`,
    GUILD_EMOJIS = `/guilds/:guild/emojis`,
    GUILD_INTEGRATION = `/guilds/:guild/integrations/:integration`,
    GUILD_INTEGRATION_SYNC = `/guilds/:guild/integrations/:integration/sync`,
    GUILD_INTEGRATIONS = `/guilds/:guild/integrations`,
    GUILD_INVITES = `/guilds/:guild/invites`,
    GUILD_VANITY_URL = `/guilds/:guild/vanity-url`,
    GUILD_MEMBER = `/guilds/:guild/members/:member`,
    GUILD_MEMBER_NICK = `/guilds/:guild/members/:member/nick`,
    GUILD_MEMBER_ROLE = `/guilds/:guild/members/:member/roles/:role`,
    GUILD_MEMBERS = `/guilds/:guild/members`,
    GUILD_MEMBERS_SEARCH = `/guilds/:guild/members/search`,
    GUILD_MESSAGES_SEARCH = `/guilds/:guild/messages/search`,
    GUILD_PREVIEW = `/guilds/:guild/preview`,
    GUILD_PRUNE = `/guilds/:guild/prune`,
    GUILD_ROLE = `/guilds/:guild/roles/:role`,
    GUILD_ROLES = `/guilds/:guild/roles`,
    GUILD_VOICE_REGIONS = `/guilds/:guild/regions`,
    GUILD_WEBHOOKS = `/guilds/:guild/webhooks`,
    GUILD_WIDGET = `/guilds/:guild/widget`,
    GUILDS = "/guilds",
    INVITE = `/invite/:invite`,
    OAUTH2_APPLICATION = `/oauth2/applications/:application`,
    USER = `/users/:user`,
    USER_BILLING = `/users/:user/billing`,
    USER_BILLING_PAYMENTS = `/users/:user/billing/payments`,
    USER_BILLING_PREMIUM_SUBSCRIPTION = `/users/:user/billing/premium-subscription`,
    USER_CHANNELS = `/users/:user/channels`,
    USER_CONNECTIONS = `/users/:user/connections`,
    USER_CONNECTION_PLATFORM = `/users/:user/connections/:platform/:platformid`,
    USER_GUILD = `/users/:user/guilds/:guild`,
    USER_GUILDS = `/users/:user/guilds`,
    USER_MFA_CODES = `/users/:user/mfa/codes`,
    USER_MFA_TOTP_DISABLE = `/users/:user/mfa/totp/disable`,
    USER_MFA_TOTP_ENABLE = `/users/:user/mfa/totp/enable`,
    USER_NOTE = `/users/:user/note/:note`,
    USER_PROFILE = `/users/:user/profile`,
    USER_RELATIONSHIP = `/users/:user/relationships/:relationship`,
    USER_SETTINGS = `/users/:user/settings`,
    USERS = "/users",
    VOICE_REGIONS = "/voice/regions",
    WEBHOOK = `/webhooks/:hook`,
    WEBHOOK_SLACK = `/webhooks/:hook/slack`,
    WEBHOOK_TOKEN = `/webhooks/:hook/:hook_token`,
    WEBHOOK_TOKEN_SLACK = `/webhooks/:hook/:hook_token/slack`
}

export enum CDNEndpoints {
    CHANNEL_ICON = `/channel-icons/:channel/:icon`,
    CUSTOM_EMOJI = `/emojis/:emoji`,
    DEFAULT_USER_AVATAR = `/embed/avatars/:discriminator`,
    GUILD_BANNER = `/banners/:guild/:banner`,
    GUILD_DISCOVERY_SPLASH = `/discovery-splashes/:guild/:discovery_splash`,
    GUILD_ICON = `/icons/:guild/:guild_icon`,
    GUILD_SPLASH = `/splashes/:guild/:splash`,
    USER_AVATAR = `/avatars/:user/:avatar`,
}

export enum ClientEndpoints {
    MESSAGE_LINK = "/channels/:guild/:channel/:message"
}

export enum MessageTypes {
    DEFAULT = 0,
    RECIPIENT_ADD = 1,
    RECIPIENT_REMOVE = 2,
    CALL = 3,
    CHANNEL_NAME_CHANGE = 4,
    CHANNEL_ICON_CHANGE = 5,
    CHANNEL_PINNED_MESSAGE = 6,
    GUILD_MEMBER_JOIN = 7,
    USER_PREMIUM_GUILD_SUBSCRIPTION = 8,
    USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1 = 9,
    USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2 = 10,
    USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3 = 11,
    CHANNEL_FOLLOW_ADD = 12,
    GUILD_DISCOVERY_DISQUALIFIED = 14,
    GUILD_DISCOVERY_REQUALIFIED = 15,
    REPLY = 19,
    APPLICATION_COMMAND = 20
}

export enum ChannelTypes {
    TEXT = 0,
    DM = 1,
    VOICE = 2,
    GROUP = 3,
    CATEGORY = 4,
    NEWS = 5,
    STORE = 6
};

/*
    Interfaces
*/

export interface MessageReference {
    channelID: Snowflake,
    guildID: Snowflake,
    messageID: Snowflake
}

export interface ManagerOptions {
    cache?: boolean,
}

/*
    Types
*/

export type Snowflake = string;

export type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

/*
    Other constants
*/

export const BASE_URL = Urls.Base + REST_VERSION;

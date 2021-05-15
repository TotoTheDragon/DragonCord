import { CacheOptions } from "@developerdragon/advancedcache";
import { config } from "dotenv";
import moment from "moment";
import { ClientOptions } from "../client/BaseClient";
import { DCFile } from "./DCFile";

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
    logLevel: "info",
    concordiaEnabled: true,
    concordiaHost: process.env.CONCORDIA_HOST || undefined,
    concordiaPort: parseInt(process.env.CONCORDIA_PORT) || undefined
}

export const DefaultManagerOptions: ManagerOptions = {
    cache: true,
    cacheOptions: {
        cacheDuration: moment.duration("2", "hours"),
        autoClean: true,
        autoCleanInterval: moment.duration("10", "minutes")
    }
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

export enum ChannelType {
    TEXT = 0,
    DM = 1,
    VOICE = 2,
    // GROUP not implemented because we do not support user accounts
    CATEGORY = 4,
    NEWS = 5,
    STORE = 6,
    STAGE = 13
};

export enum Colors {
    DEFAULT = 0x000000,
    WHITE = 0xffffff,
    AQUA = 0x1abc9c,
    GREEN = 0x2ecc71,
    BLUE = 0x3498db,
    YELLOW = 0xffff00,
    PURPLE = 0x9b59b6,
    LUMINOUS_VIVID_PINK = 0xe91e63,
    GOLD = 0xf1c40f,
    ORANGE = 0xe67e22,
    RED = 0xe74c3c,
    GREY = 0x95a5a6,
    NAVY = 0x34495e,
    DARK_AQUA = 0x11806a,
    DARK_GREEN = 0x1f8b4c,
    DARK_BLUE = 0x206694,
    DARK_PURPLE = 0x71368a,
    DARK_VIVID_PINK = 0xad1457,
    DARK_GOLD = 0xc27c0e,
    DARK_ORANGE = 0xa84300,
    DARK_RED = 0x992d22,
    DARK_GREY = 0x979c9f,
    DARKER_GREY = 0x7f8c8d,
    LIGHT_GREY = 0xbcc0c0,
    DARK_NAVY = 0x2c3e50,
    BLURPLE = 0x7289da,
    GREYPLE = 0x99aab5,
    DARK_BUT_NOT_BLACK = 0x2c2f33,
    NOT_QUITE_BLACK = 0x23272a,
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
    cacheOptions?: CacheOptions
}

export interface DiscordMessageContent {
    content?: string,
    embed?: any,
    allowedMentions?: any,
    tts?: boolean
}

export interface DiscordEditMessageContent {
    [x: string]: any;
    content?: string,
    embed?: any,
    allowedMentions?: any,
    flags?: number
}

/*
    Method parameters for options
*/

export interface CreateChannelOptions {
    bitrate?: number,
    nsfw?: boolean,
    parentID?: string,
    permissionOverwrites?: any[],
    messageCooldown?: number,
    topic?: string,
    userLimit?: number,
    reason?: string
}

export interface EditChannelOptions extends CreateChannelOptions {
    name?: string
}

export interface CreateChannelInviteOptions {
    maxAge?: number,
    maxUses?: number,
    temporary?: boolean,
    unique?: boolean,
    reason?: string
}

export interface CreateChannelWebhookOptions {
    name?: string,
    avatar?: string,
    reason?: string
}

export interface CreateGuildOptions {
    region?: string,
    icon?: string,
    verificationLevel?: number,
    defaultNotifications?: number,
    explicitContentFilter?: number,
    systemChannelID?: Snowflake,
    afkChannelID?: Snowflake,
    afkTimeout?: number,
    roles?: any[],
    channels?: any[]
}

export interface EditGuildOptions extends CreateGuildOptions {
    name?: string
    rulesChannelID?: Snowflake;
    publicUpdatesChannelID?: Snowflake;
    preferredLocale?: string;
    ownerID?: Snowflake;
    splash?: string;
    banner?: string;
    description?: string;
    reason?: string;
}

export interface CreateGuildEmojiOptions {
    name: string,
    image: string,
    roles?: Snowflake[],
    reason?: string
}

export interface CreateRoleOptions {
    name?: string,
    color?: number,
    hoist?: boolean,
    mentionable?: boolean,
    permissions?: number,
    reason?: string
}

export interface EditGuildIntegration {
    expireBehavior?: string,
    expireGracePeriod?: string,
    enableEmoticons?: boolean
}

export interface EditGuildMemberOptions {
    roles?: Snowflake[],
    nick?: string,
    mute?: boolean,
    deafen?: boolean,
    channelID?: Snowflake,
    reason?: string
}

export interface EditBotUserOptions {
    username?: string,
    avatar?: string
}

export interface VoiceChannelOptions {
    opusOnly?: boolean,
    shared?: boolean
}

export interface PruneMembersOptions {
    computePruneCount?: boolean,
    days?: number,
    includeRoles?: Snowflake[],
    reason?: string
}

export interface StatusOptions {
    status?: UserStatus,
    name?: string,
    type?: number,
    url?: string
}

export interface WebhookOptions {
    allowedMentions?: any,
    auth?: boolean,
    avatarURL?: string,
    content?: string,
    embeds?: any[],
    file?: DCFile | DCFile[],
    tts?: boolean,
    username?: string,
    wait?: boolean
}

/*
    Types
*/

export type Snowflake = string;

export type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export type UserStatus = "online" | "idle" | "dnd" | "invisible";

/*
    Other constants
*/

export const BASE_URL = Urls.Base + REST_VERSION;

/*
    Websocket
*/

export enum GatewayOPCodes {
    EVENT = 0,
    HEARTBEAT = 1,
    IDENTIFY = 2,
    STATUS_UPDATE = 3,
    VOICE_STATE_UPDATE = 4,
    VOICE_STATE_PING = 5,
    RESUME = 6,
    REQUEST_GUILD_MEMBERS = 8,
    INVALID_SESSION = 9,
    HELLO = 10,
    ACK = 11,
    GUILD_SYNC = 12,
    CALL_SYNC = 13
}

export enum GatewayCloseCodes {
    NO_ERROR = 1000,
    UNKNOWN_ERROR = 4000,
    UNKNOWN_OP = 4001,
    DECODE_ERROR = 4002,
    NOT_AUTHENTICATED = 4003,
    AUTHENTICATION_FAILED = 4004,
    ALREADY_AUTHENTICATED = 4005,
    INVALID_SEQUENCE = 4007,
    RATE_LIMITED = 4008,
    SESSION_TIMEOUT = 4009,
    INVALID_SHARD = 4010,
    SHARDING_REQUIRED = 4011,
    INVALID_API_VERSION = 4012,
    INVALID_INTENTS = 4013,
    DISALLOWED_INTENTS = 4014
}

export enum VoiceOPCodes {
    IDENTIFY = 0,
    SELECT_PROTOCOL = 1,
    READY = 2,
    HEARTBEAT = 3,
    SESSION_DESCRIPTION = 4,
    SPEAKING = 5,
    HEARTBEAT_ACK = 6,
    RESUME = 7,
    HELLO = 8,
    RESUMED = 9,
    DISCONNECT = 13
}

export enum VoiceCloseCodes {
    NO_ERROR = 1000,
    UNKNOWN_OP = 4001,
    DECODE_ERROR = 4002,
    NOT_AUTHENTICATED = 4003,
    AUTHENTICATION_FAILED = 4004,
    ALREADY_AUTHENTICATED = 4005,
    SESSION_INVALID = 4006,
    SESSION_TIMEOUT = 4009,
    SERVER_NOT_FOUND = 4011,
    UNKNOWN_PROTOCOL = 4012,
    DISCONNECTED = 4014,
    VOICE_SERVER_CRASHED = 4015,
    UNKNOWN_ENCRYPTION = 4016
}

export enum GatewayEvent {

    PRESENCE_UPDATE = "presenceUpdate",
    VOICE_STATE_UPDATE = "voiceStateUpdate",
    TYPING_START = "typingStart",

    RESUMED = "resumed",
    READY = "ready",
    VOICE_SERVER_UPDATE = "voiceServerUpdate",
    USER_UPDATE = "userUpdate",

    /*
        Messages
    */

    MESSAGE_CREATE = "messageCreate",
    MESSAGE_UPDATE = "messageUpdate",
    MESSAGE_DELETE = "messageDelete",
    MESSAGE_DELETE_BULK = "messageDeleteBulk",
    MESSAGE_REACTION_ADD = "messageReactionAdd",
    MESSAGE_REACTION_REMOVE = "messageReactionRemove",
    MESSAGE_REACTION_REMOVE_ALL = "messageReactionRemoveAll",
    MESSAGE_REACTION_REMOVE_EMOJI = "messageReactionRemoveEmoji",

    MESSAGE_ACK = "messageAck",

    /*
        Guilds
    */

    GUILD_MEMBER_ADD = "guildMemberAdd",
    GUILD_MEMBER_UPDATE = "guildMemberUpdate",
    GUILD_MEMBER_REMOVE = "guildMemberRemove",
    GUILD_CREATE = "guildCreate",
    GUILD_UPDATE = "guildUpdate",
    GUILD_DELETE = "guildDelete",
    GUILD_BAN_ADD = "guildBanAdd",
    GUILD_BAN_REMOVE = "guildBanRemove",
    GUILD_ROLE_CREATE = "guildRoleCreate",
    GUILD_ROLE_UPDATE = "guildRoleUpdate",
    GUILD_ROLE_DELETE = "guildRoleDelete",
    GUILD_MEMBERS_CHUNK = "guildMemberChunk",
    GUILD_SYNC = "guildSync",
    GUILD_EMOJIS_UPDATE = "guildEmojisUpdate",

    PRESENCES_REPLACE = "presencesReplace",

    /*
        Invites
    */

    INVITE_CREATE = "inviteCreate",
    INVITE_DELETE = "inviteDelete",

    /*
        Channels
    */

    CHANNEL_CREATE = "channelCreate",
    CHANNEL_UPDATE = "channelUpdate",
    CHANNEL_DELETE = "channelDelete",
    CHANNEL_PINS_UPDATE = "channelPinUpdate",
    WEBHOOKS_UPDATE = "webhooksUpdate",
    CALL_CREATE = "callCreate",
    CALL_UPDATE = "callUpdate",
    CALL_DELETE = "callDelete"

}
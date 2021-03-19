import { ClientOptions } from "../client/BaseClient";
import { config } from "dotenv";
import { CacheOptions } from "@developerdragon/advancedcache";
import moment from "moment";

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
    debug: false,
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

export enum ChannelTypes {
    TEXT = 0,
    DM = 1,
    VOICE = 2,
    GROUP = 3,
    CATEGORY = 4,
    NEWS = 5,
    STORE = 6
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

/*
    Types
*/

export type Snowflake = string;

export type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

/*
    Other constants
*/

export const BASE_URL = Urls.Base + REST_VERSION;

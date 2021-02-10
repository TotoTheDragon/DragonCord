import { ClientOptions } from "../client/BaseClient";
import { Collection } from "./Collection";

/*
    Constant values
*/

export const DefaultOptions: ClientOptions = {
    shardCount: 1,
    messageCacheMaxSize: 200,
    messageCacheLifetime: 0,
    messageSweepInterval: 0,
    restWsBridgeTimeout: 5000,
    restRequestTimeout: 15000,
    retryLimit: 1,
    restTimeOffset: 500,
    restSweepInterval: 60
}

export const DefaultManagerOptions: ManagerOptions = {
    cache: true,
}

/*
    Enums
*/

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
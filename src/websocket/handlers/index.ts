import { ready } from "./basic/READY";
import { channelCreate } from "./channel/CHANNEL_CREATE";
import { channelDelete } from "./channel/CHANNEL_DELETE";
import { channelUpdate } from "./channel/CHANNEL_UPDATE";
import { guildBanAdd } from "./guild/GUILD_BAN_ADD";
import { guildBanRemove } from "./guild/GUILD_BAN_REMOVE";
import { guildCreate } from "./guild/GUILD_CREATE";
import { guildDelete } from "./guild/GUILD_DELETE";
import { guildMemberAdd } from "./guild/GUILD_MEMBER_ADD";
import { guildMemberRemove } from "./guild/GUILD_MEMBER_REMOVE";
import { guildMemberUpdate } from "./guild/GUILD_MEMBER_UPDATE";
import { guildRoleCreate } from "./guild/GUILD_ROLE_CREATE";
import { guildRoleRemove as guildRoleDelete } from "./guild/GUILD_ROLE_DELETE";
import { guildRoleUpdate } from "./guild/GUILD_ROLE_UPDATE";
import { guildUpdate } from "./guild/GUILD_UPDATE";
import { messageCreate } from "./message/MESSAGE_CREATE";
import { messageDelete } from "./message/MESSAGE_DELETE";
import { messageUpdate } from "./message/MESSAGE_UPDATE";
import { interactionCreate } from "./other/INTERACTION_CREATE";
import { presenceUpdate } from "./user/PRESENCE_UPDATE";

export const handlers = {
    "READY": ready,

    "MESSAGE_CREATE": messageCreate,
    "MESSAGE_UPDATE": messageUpdate,
    "MESSAGE_DELETE": messageDelete,

    "GUILD_CREATE": guildCreate,
    "GUILD_UPDATE": guildUpdate,
    "GUILD_DELETE": guildDelete,

    "GUILD_MEMBER_ADD": guildMemberAdd,
    "GUILD_MEMBER_UPDATE": guildMemberUpdate,
    "GUILD_MEMBER_REMOVE": guildMemberRemove,

    "GUILD_BAN_ADD": guildBanAdd,
    "GUILD_BAN_REMOVE": guildBanRemove,

    "GUILD_ROLE_CREATE": guildRoleCreate,
    "GUILD_ROLE_UPDATE": guildRoleUpdate,
    "GUILD_ROLE_DELETE": guildRoleDelete,

    "CHANNEL_CREATE": channelCreate,
    "CHANNEL_DELETE": channelDelete,
    "CHANNEL_UPDATE": channelUpdate,

    "INTERACTION_CREATE": interactionCreate,
    "PRESENCE_UPDATE": presenceUpdate,
}
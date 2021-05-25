import { guildCreate } from "./GUILD_CREATE";
import { messageCreate } from "./MESSAGE_CREATE";
import { messageUpdate } from "./MESSAGE_UPDATE";
import { ready } from "./READY";

export const handlers = {
    "READY": ready,
    "MESSAGE_CREATE": messageCreate,
    "MESSAGE_UPDATE": messageUpdate,
    "GUILD_CREATE": guildCreate
}
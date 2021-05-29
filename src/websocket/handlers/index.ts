import { guildCreate } from "./GUILD_CREATE";
import { interactionCreate } from "./INTERACTION_CREATE";
import { messageCreate } from "./MESSAGE_CREATE";
import { messageUpdate } from "./MESSAGE_UPDATE";
import { presenceUpdate } from "./PRESENCE_UPDATE";
import { ready } from "./READY";

export const handlers = {
    "READY": ready,
    "MESSAGE_CREATE": messageCreate,
    "MESSAGE_UPDATE": messageUpdate,
    "GUILD_CREATE": guildCreate,
    "INTERACTION_CREATE": interactionCreate,
    "PRESENCE_UPDATE": presenceUpdate
}
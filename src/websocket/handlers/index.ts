import { guild_create } from "./GUILD_CREATE";
import { message_create } from "./MESSAGE_CREATE";
import { ready } from "./READY";

export const handlers = {
    "READY": ready,
    "MESSAGE_CREATE": message_create,
    "GUILD_CREATE": guild_create
}
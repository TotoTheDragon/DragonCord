import { Client } from "../../../client/Client";
import { Guild } from "../../../structure/guild/Guild";

export function guildDelete(client: Client, data: any) {
    const guild: Guild = client.guilds.remove(data);
    client.logger.silly("Event > GUILD_DELETE", "event", "guildDelete", guild.serialize());
    client.emit("guildDelete", guild);
}
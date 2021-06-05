import { Client } from "../../../client/Client";
import { Guild } from "../../../structure/guild/Guild";

export function guildUpdate(client: Client, data: any) {
    const guild: Guild = client.guilds.add(data)
    client.logger.silly("Event > GUILD_UPDATE", "event", "guildUpdate", guild.serialize());
    client.emit("guildUpdate", guild);
}
import { Client } from "../../../client/Client";
import { Guild } from "../../../structure/guild/Guild";

export function guildCreate(client: Client, data: any) {
    const guild: Guild = client.guilds.add(data)
    client.logger.silly("Event > GUILD_CREATE", "event", "guildCreate", guild.serialize());
    client.emit("guildCreate", guild);
}
import { Client } from "../../client/Client";
import { Guild } from "../../structure/guild/Guild";

export function guild_create(client: Client, { d: data }, shard: number) {
    const guild: Guild = client.guilds.add(data)
    client.logger.emit("DEBUG", "GUILD_CREATE", JSON.stringify(guild.serialize()));
    client.emit("guildCreate", guild);
}
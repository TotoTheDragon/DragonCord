import { Client } from "../../client/Client";
import { Guild } from "../../structure/guild/Guild";

export function guild_create(client: Client, { d: data }, shard: number) {
    const guild: Guild = client.guilds.add(data)
    client.logger.silly("Event > GUILD_CREATE", "event", "guildCreate", guild.serialize());
    client.emit("guildCreate", guild);
}
import { Client } from "../../client/Client";

export function guild_create(client: Client, { d: data }, shard: number) {
    client.logger.emit("DEBUG", "GUILD_CREATE", data.id);
    client.emit("guildCreate", client.guilds.add(data));
}
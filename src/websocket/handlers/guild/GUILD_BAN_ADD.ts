import { Client } from "../../../client/Client";

export function guildBanAdd(client: Client, data: any) {
    const guild = client.guilds.get(data.guild_id);
    const user = client.users.add(data.user);
    client.logger.silly("Event > GUILD_BAN_ADD", "event", "guildBanAdd", data);
    client.emit("guildBanAdd", guild, user);
}
import { Client } from "../../../client/Client";

export function guildBanRemove(client: Client, data: any) {
    const guild = client.guilds.get(data.guild_id);
    const user = client.users.add(data.user);
    client.logger.silly("Event > GUILD_BAN_REMOVE", "event", "guildBanRemove", data);
    client.emit("guildBanRemove", guild, user);
}
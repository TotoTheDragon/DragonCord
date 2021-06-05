import { Client } from "../../../client/Client";
import { Role } from "../../../structure/Role";

export function guildRoleUpdate(client: Client, data: any) {
    const role: Role = client.guilds.get(data.guild_id).roles.add(data.role);
    client.logger.silly("Event > GUILD_ROLE_UPDATE", "event", "guildRoleUpdate", role);
    client.emit("guildRoleUpdate", role);
}
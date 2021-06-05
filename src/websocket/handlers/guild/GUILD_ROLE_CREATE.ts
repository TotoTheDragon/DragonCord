import { Client } from "../../../client/Client";
import { Role } from "../../../structure/Role";

export function guildRoleCreate(client: Client, data: any) {
    const role: Role = client.guilds.get(data.guild_id).roles.add(data.role);
    client.logger.silly("Event > GUILD_ROLE_CREATE", "event", "guildRoleCreate", role);
    client.emit("guildRoleCreate", role);
}
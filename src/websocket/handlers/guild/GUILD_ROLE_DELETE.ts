import { Client } from "../../../client/Client";
import { Role } from "../../../structure/Role";

export function guildRoleRemove(client: Client, data: any) {
    const role: Role = client.guilds.get(data.guild_id).roles.remove(data.role);
    client.logger.silly("Event > GUILD_ROLE_REMOVE", "event", "guildRoleRemove", role);
    client.emit("guildRoleRemove", role);
}
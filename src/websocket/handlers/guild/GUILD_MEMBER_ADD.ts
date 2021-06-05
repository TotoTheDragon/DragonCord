import { Client } from "../../../client/Client";
import { Guild } from "../../../structure/guild/Guild";
import { GuildMember } from "../../../structure/guild/GuildMember";

export function guildMemberAdd(client: Client, data: any) {
    const guild: Guild = client.guilds.get(data.guild_id);
    const member: GuildMember = guild.members.add(data);
    client.logger.silly("Event > GUILD_MEMBER_ADD", "event", "guildMemberAdd", member.serialize());
    client.emit("guildMemberAdd", member);
}
import { Client } from "../../../client/Client";
import { Guild } from "../../../structure/guild/Guild";
import { GuildMember } from "../../../structure/guild/GuildMember";

export function guildMemberUpdate(client: Client, data: any) {
    const guild: Guild = client.guilds.get(data.guild_id);
    const member: GuildMember = guild.members.add(data);
    client.logger.silly("Event > GUILD_MEMBER_UPDATE", "event", "guildMemberUpdate", member.serialize());
    client.emit("guildMemberUpdate", member);
}
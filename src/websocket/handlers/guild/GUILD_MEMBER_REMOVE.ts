import { Client } from "../../../client/Client";
import { Guild } from "../../../structure/guild/Guild";
import { GuildMember } from "../../../structure/guild/GuildMember";

export function guildMemberRemove(client: Client, data: any) {
    const guild: Guild = client.guilds.get(data.guild_id);
    const member: GuildMember = guild.members.remove(data, guild);
    client.logger.silly("Event > GUILD_MEMBER_REMOVE", "event", "guildMemberRemove", member.serialize());
    client.emit("guildMemberRemove", member);
}
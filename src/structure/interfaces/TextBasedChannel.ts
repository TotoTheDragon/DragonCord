import { ChannelType, DiscordMessageContent } from "../../util/Constants";
import { DCFile } from "../../util/DCFile";
import { Channel } from "../Channel";
import { MessageEmbed } from "../MessageEmbed";
import { PrivateChannel } from "../user/PrivateChannel";

export abstract class TextBasedChannel extends Channel {

    async send(message: string | DiscordMessageContent | MessageEmbed): Promise<any> {
        return this.sendItems(message)[0];
    }

    async sendItems(...data: any[]): Promise<any[]> {

        if (!this.id && this.type === ChannelType.DM && (this as unknown as PrivateChannel)._recipients?.length) this.id = (await this._client.getDMChannel((this as unknown as PrivateChannel)._recipients[0].id)).id;

        if (!this.id) throw Error("Trying to send message to channel without providing id")

        const content: string = data.filter(d => typeof d === "string").join(" ");

        const embed: MessageEmbed = data.find(d => d instanceof MessageEmbed);

        const files = data.filter(d => d instanceof DCFile);

        data.filter(d => d instanceof Buffer).forEach(buf => files.push(new DCFile(buf)));

        return this._client.createMessage(this.id, { content: content, embed: embed }, files);
    }
}
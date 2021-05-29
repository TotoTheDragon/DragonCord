import { Client } from "../../client/Client";
import { Snowflake } from "../../util/Constants";
import { DCFile } from "../../util/DCFile";
import { Endpoints } from "../../util/Endpoints";
import { Base } from "../Base";
import { TextBasedChannel } from "../interfaces/TextBasedChannel";
import { Message } from "../Message";
import { MessageEmbed } from "../MessageEmbed";
import { User } from "../user/User";
import { ApplicationCommandInteractionData } from "./ApplicationCommand";

export class Interaction extends Base {

    id: Snowflake;
    guildID: Snowflake; // Only if interaction originated in guild
    channelID: Snowflake;
    applicationID: Snowflake; // ID of this application
    messageID: Snowflake;

    message: Message;

    version: number;
    type: number; // Make ENUM
    token: string;
    member: Base;
    user: User;
    data: ApplicationCommandInteractionData;

    deferred: boolean;

    constructor(client: Client, data: any) {
        super(client);

        this.id = data.id;
        this.guildID = data.guild_id;
        this.channelID = data.channel_id;
        this.applicationID = data.application_id;
        this.messageID = data.message?.id;

        this.message = new Message(client, data.message);

        this.version = data.version;
        this.type = data.type;
        this.data = data.data;

        this.token = data.token;

        // TODO Implement members
        this.member = data.member;

        if ('user' in data)
            this.user = client.users.add(data.user);
        else
            this.user = client.users.add(data.member.user);
    }

    get deferType(): number {
        if (this.type === 2) return 5;
        if (this.type === 3) return 6;
        return null;
    }

    get responseType(): number {
        if (this.type === 2) return 4;
        if (this.type === 3) return 7;
        return null;
    }

    get channel(): TextBasedChannel {
        return this._client.channels.get(this.channelID);
    }

    defer(): Promise<any> {
        if (this.deferred)
            throw Error("You already deferred to this interaction before");
        this.deferred = true;
        return this._client.requestHandler.request("POST", Endpoints.INTERACTION_CALLBACK(this.id, this.token), true, { type: this.deferType });
    }

    sendFollowup(...data: any[]): Promise<any> {
        const content: string = data.filter(d => typeof d === "string").join(" ");

        const embeds: MessageEmbed[] = data.filter(d => d instanceof MessageEmbed);

        const files = data.filter(d => d instanceof DCFile);
        data.filter(d => d instanceof Buffer).forEach(buf => files.push(new DCFile(buf)));

        return this._client.requestHandler.request("POST", Endpoints.INTERACTION(this.applicationID, this.token), true, { content, embeds }, files);
    }

    sendResponse(...data: any[]): Promise<any> {
        if (this.deferred)
            return this.sendFollowup(...data);
        else
            return this.executeCallback(...data);
    }

    editResponse(...data: any[]): Promise<any> {
        const content: string = data.filter(d => typeof d === "string").join(" ");

        const embeds: MessageEmbed[] = data.filter(d => d instanceof MessageEmbed);

        const files = data.filter(d => d instanceof DCFile);
        data.filter(d => d instanceof Buffer).forEach(buf => files.push(new DCFile(buf)));

        return this._client.requestHandler.request("PATCH", Endpoints.INTERACTION_ORIGINAL(this.applicationID, this.token), true, { content, embeds }, files);
    }

    executeCallback(...data: any[]): Promise<any> {
        const content: string = data.filter(d => typeof d === "string").join(" ");

        const embeds: MessageEmbed[] = data.filter(d => d instanceof MessageEmbed);

        const files = data.filter(d => d instanceof DCFile);
        data.filter(d => d instanceof Buffer).forEach(buf => files.push(new DCFile(buf)));

        return this._client.requestHandler.request("POST", Endpoints.INTERACTION_CALLBACK(this.id, this.token), true, { type: this.responseType, data: { content, embeds } }, files);
    }

    sendChannelResponse(...data: any[]): Promise<any> {
        return this.channel.sendItems(...data);
    }

    serialize(props: string[] = []): object {
        return super.serialize([
            "id",
            "channelID",
            "guildID",
            "type",
            "user",
            ...props
        ])
    }
}
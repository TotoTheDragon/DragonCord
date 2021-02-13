import { APIRequest } from "../../rest/APIRequest";
import { requestBuilder } from "../../rest/RequestBuilder";
import { Channel } from "../Channel";
import { MessageEmbed } from "../MessageEmbed";

export class TextBasedChannel extends Channel {

    async send(...data: any[]) {
        const request: APIRequest = requestBuilder(this.client)
            .channels(this.id)
            .messages
            .post();

        const content = data.filter(d => typeof d === "string").join(" ");

        const embed = (data.find(d => d instanceof MessageEmbed) as MessageEmbed)?.toJSON();

        return request.setBody({ content: content, embed: embed }).make();
    }
}
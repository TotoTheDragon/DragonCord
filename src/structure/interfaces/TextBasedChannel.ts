import { APIRequest } from "../../rest/APIRequest";
import { requestBuilder } from "../../rest/RequestBuilder";
import { Channel } from "../Channel";

export class TextBasedChannel extends Channel {

    async send(...data: any[]) {
        const request: APIRequest = requestBuilder(this.client)
            .channels(this.id)
            .messages
            .post();

        const content = data.filter(d => typeof d === "string").join(" ");

        return request.setBody({ content: content }).make();
    }
}
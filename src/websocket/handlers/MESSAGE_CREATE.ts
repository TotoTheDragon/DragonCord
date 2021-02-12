import { Client } from "../../client/Client";
import { APIRequest } from "../../rest/APIRequest";
import { requestBuilder } from "../../rest/RequestBuilder";
import { Message } from "../../structure/Message";

export async function message_create(client: Client, { d: data }, shard: number) {
    const message = new Message(client, data)
    if (client.options.channelCache && message.guild) {
        const channelRequest: APIRequest = requestBuilder(client)
            .channels(message.channelID)
            .get();
        message.guild.channels.add(await channelRequest.make());
    }
    client.logger.emit("DEBUG", "MESSAGE", JSON.stringify(message.serialize()));
    client.emit("message", message);
}
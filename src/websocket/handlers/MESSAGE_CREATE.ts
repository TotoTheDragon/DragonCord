import { Client } from "../../client/Client";
import { Message } from "../../structure/Message";

export async function message_create(client: Client, { d: data }, shard: number) {
    const message = new Message(client, data)
    // if (client.options.channelCache && message.guild) {
    //     const channelRequest: APIRequest = requestBuilder(client)
    //         .channels(message.channelID)
    //         .get();
    //     message.guild.channels.add(await channelRequest.make());
    // }
    client.logger.silly("Event > MESSAGE", "event", "messageCreate", message.serialize());
    client.emit("message", message);
}
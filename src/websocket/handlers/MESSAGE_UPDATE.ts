import { Client } from "../../client/Client";
import { Message } from "../../structure/Message";

export async function messageUpdate(client: Client, { d: data }, shard: number) {
    const message = new Message(client, data)

    client.logger.silly("Event > MESSAGE", "event", "messageUpdate", message.serialize());
    client.emit("messageUpdate", message);
}
import { Client } from "../../client/Client";
import { Message } from "../../structure/Message";

export function message_create(client: Client, { d: data }, shard: number) {
    const message = new Message(client, data)
    client.logger.emit("DEBUG", "MESSAGE", JSON.stringify(message.serialize()));
    client.emit("message", message);
}
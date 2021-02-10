import { Client } from "../../client/Client";
import { Message } from "../../structure/Message";

export function message_create(client: Client, { d: data }, shard: number) {
    client.emit("message", new Message(client, data));
}
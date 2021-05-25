import { Client } from "../../client/Client";

export async function message_create(client: Client, { d: data }, shard: number) {
    const message = client.messages.add(data);
    client.logger.silly("Event > MESSAGE", "event", "messageCreate", message.serialize());
    client.emit("message", message);
}
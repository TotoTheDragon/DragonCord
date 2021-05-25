import { Client } from "../../client/Client";

export async function messageUpdate(client: Client, { d: data }, shard: number) {
    const message = client.messages.add(data);
    client.logger.silly("Event > MESSAGE", "event", "messageUpdate", message.serialize());
    client.emit("messageUpdate", message);
}
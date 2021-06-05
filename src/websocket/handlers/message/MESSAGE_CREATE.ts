import { Client } from "../../../client/Client";

export async function messageCreate(client: Client, data: any) {
    const message = client.messages.add(data);
    client.logger.silly("Event > MESSAGE", "event", "messageCreate", message.serialize());
    client.emit("message", message);
}
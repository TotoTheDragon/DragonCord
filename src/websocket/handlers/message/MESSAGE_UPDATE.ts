import { Client } from "../../../client/Client";

export async function messageUpdate(client: Client, data: any) {
    const message = client.messages.add(data);
    client.logger.silly("Event > MESSAGE", "event", "messageUpdate", message.serialize());
    client.emit("messageUpdate", message);
}
import { Client } from "../../../client/Client";
import { Message } from "../../../structure/Message";

export async function messageDelete(client: Client, data: any) {
    console.log(data);
    const message: Message = client.messages.add(data);
    message._update({ deleted: true })
    client.logger.silly("Event > MESSAGE_DELETE", "event", "messageDelete", message.serialize());
    client.emit("messageDelete", message);
}
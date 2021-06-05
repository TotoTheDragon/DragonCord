import { Client } from "../../../client/Client";

export function channelCreate(client: Client, data: any) {
    const channel = client.channels.add(data);
    client.logger.silly("Event > CHANNEL_CREATE", "event", "channelCreate", channel.serialize());
    client.emit("channelCreate", channel);
}
import { Client } from "../../../client/Client";

export function channelUpdate(client: Client, data: any) {
    const channel = client.channels.add(data);
    client.logger.silly("Event > CHANNEL_UPDATE", "event", "channelUpdate", channel.serialize());
    client.emit("channelUpdate", channel);
}
import { Client } from "../../../client/Client";

export function channelDelete(client: Client, data: any) {
    const channel = client.channels.add(data);
    channel._update({ deleted: true })
    client.logger.silly("Event > CHANNEL_DELETE", "event", "channelDelete", channel.serialize());
    client.emit("channelDelete", channel);
}
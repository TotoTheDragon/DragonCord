import { Client } from "../../client/Client";
import { ClientUser } from "../../client/ClientUser";

export function ready(client: Client, data: any) {
    if (data.guilds)
        for (const guild of data.guilds)
            client.guilds.add(guild);
    client.user = new ClientUser(client, data.user);
    client.ws.session = data.session_id;
    client.logger.debug("Event > READY", "event", "ready", { shard: client.options.shard ?? 0 })
    client.emit("ready", client.options.shard ?? 0);
}
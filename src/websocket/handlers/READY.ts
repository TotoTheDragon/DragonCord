import { Client } from "../../client/Client";
import { ClientUser } from "../../client/ClientUser";

export function ready(client: Client, { d: data }, shard: number) {
    if (data.guilds)
        for (const guild of data.guilds)
            client.guilds.add(guild);

    client.user = new ClientUser(client, data.user);

    client.ws.session = data.session_id;
    client.emit("ready");
}
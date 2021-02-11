import { Client } from "../../client/Client";

export function ready(client: Client, { d: data }, shard: number) {
    client.ws.session = data.session_id;
    client.emit("ready");
}
import { Client } from "../../client/Client";

export function ready(client: Client, { d: data }, shard: number) {
    client.emit("ready");
}
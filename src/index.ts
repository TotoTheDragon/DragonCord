import { Client } from "./client/Client";
import { WebsocketManager } from "./websocket/WebsocketManager";

const delay = ms => new Promise(res => setTimeout(res, ms));

async function start(): Promise<void> {

    const client1 = new Client({ shard: 0, shardCount: 2 });

    const client2 = new Client({ shard: 1, shardCount: 2 });

    client1.on("ready", () => console.log("Bot ready (shard 0)"))
    client2.on("ready", () => console.log("Bot ready (shard 1)"))

    await client1.login("ODA2NjQ0MjEyOTc1NTM0MTQw.YBsb9w.S5cEIP4Z8BK2ImBLTsZ4Vejtn4g");

    await delay(5000);

    await client2.login("ODA2NjQ0MjEyOTc1NTM0MTQw.YBsb9w.S5cEIP4Z8BK2ImBLTsZ4Vejtn4g");
}

start();
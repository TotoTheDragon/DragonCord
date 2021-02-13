import { Client } from "./client/Client";
import { requestBuilder } from "./rest/RequestBuilder";
import { GuildChannel } from "./structure/guild/GuildChannel";
import { Message } from "./structure/Message";
import { MessageEmbed } from "./structure/MessageEmbed";

const delay = ms => new Promise(res => setTimeout(res, ms));

async function start(): Promise<void> {

    const client = new Client({ shard: 0, shardCount: 1, debug: true });

    client.on("ready", () => client.logger.emit("LOG", "READY", "Bot is now ready"));

    client.on("message", async (message: Message) => {
        if (message.author.id !== "297362162349768705") return;
        message.channel.send("You said:", message.content, new MessageEmbed().setTitle("Repeater").setDescription(message.content));
    });

    await client.login();
}

start();
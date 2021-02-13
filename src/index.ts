import { Client } from "./client/Client";
import { Message } from "./structure/Message";
import { MessageEmbed } from "./structure/MessageEmbed";

const delay = ms => new Promise(res => setTimeout(res, ms));

async function start(): Promise<void> {

    const client = new Client({ shard: 0, shardCount: 1, debug: true });

    client.on("ready", () => client.logger.emit("LOG", "READY", "Bot is now ready in", client.guilds.cache.size, "guilds on shard", client.options.shard));

    client.on("message", async (message: Message) => {
        if (message.author.id === client.user.id) return;
        if (message.isGuild)
            message.channel.send("You said:", message.content, new MessageEmbed().setTitle("Repeater").setDescription(message.content));
        else message.author.send("You said:", message.content, new MessageEmbed().setTitle("Repeater").setDescription(message.content));
    });

    await client.login();
}

start();
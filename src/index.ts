import { Client } from "./client/Client";
import { GuildMember } from "./structure/guild/GuildMember";
import { Interaction } from "./structure/interaction/Interaction";
import { Message } from "./structure/Message";

const delay = ms => new Promise(res => setTimeout(res, ms));

async function start(): Promise<void> {

    const client = new Client({ logLevel: "silly", concordiaEnabled: true, concordiaToken: "DragonCord Test", intents: 32767 });
    client.on("ready", () => client.logger.info("Bot is now ready", "ready", { guilds: client.guilds.cache.size, shard: client.options.shard }));

    client.on("message", async (message: Message) => {
    });

    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.type === 2) return;;
        await interaction.defer();
        const pressedButton = interaction.message.components.getButtonByID(interaction.data.custom_id);
        await interaction.sendResponse(`You selected:`, pressedButton.label);
    })

    //client.on("message", async (message: Message) => {
    //    if (message.author.id === client.user.id) return;
    //
    //    const args = message.content.split(" ");
    //    const command = args.shift();
    //
    //    switch (command) {
    //        case "guild":
    //            return console.log(client.guilds.resolve(args[0]));
    //        case "channel":
    //            return console.log(client.channels.resolve(args[0]));
    //    }
    //
    //});

    await client.login();
}


start();
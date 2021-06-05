import { Client } from "../../../client/Client";
import { Interaction } from "../../../structure/interaction/Interaction";

export async function interactionCreate(client: Client, data: any) {
    const interaction = new Interaction(client, data);
    client.logger.silly("INTERACTION", interaction.serialize());
    client.emit("interactionCreate", interaction);
}
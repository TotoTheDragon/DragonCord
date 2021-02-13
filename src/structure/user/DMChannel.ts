import { Client } from "../../client/Client";
import { TextBasedChannel } from "../interfaces/TextBasedChannel";
import { User } from "./User";

export class DMChannel extends TextBasedChannel {

    recipient: User;

    constructor(client: Client, data: any, recipient: User) {
        super(client, data);
        this.recipient = recipient;
    }

}
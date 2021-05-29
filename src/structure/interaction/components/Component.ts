import { Client } from "../../../client/Client";
import { Base } from "../../Base";

export class MessageComponent extends Base {

    type: number;

    constructor(client: Client, data: any) {
        super(client);

        this.type = data.type;
    }


}
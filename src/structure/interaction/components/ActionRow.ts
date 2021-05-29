import { Client } from "../../../client/Client";
import { Util } from "../../../util/Util";
import { Button } from "./Button";
import { MessageComponent } from "./Component";
import { ComponentHolder } from "./ComponentHolder";

export class ActionRow extends MessageComponent {

    buttons: Button[];

    index?: number;
    parent?: ComponentHolder;

    constructor(client: Client, data: any) {
        super(client, data);

        this._deserialize(data);
    }

    _deserialize(data: any) {
        return this._update(data);
    }

    _update(data: any) {
        if ('components' in data)
            this.buttons = data.components.map(data => Util.createMessageComponent(this._client, data));

        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].parent = this
            this.buttons[i].index = i
        }
    }
}
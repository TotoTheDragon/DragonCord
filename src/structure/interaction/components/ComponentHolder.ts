import { Data } from "ws";
import { Client } from "../../../client/Client";
import { Base } from "../../Base";
import { ActionRow } from "./ActionRow";
import { Button } from "./Button";

export class ComponentHolder extends Base {

    rows: ActionRow[];

    constructor(client: Client, data: Data) {
        super(client);

        this._deserialize(data);
    }

    getButtonByID(id: string): Button {
        for (const row of this.rows) {
            for (const button of row.buttons) {
                if (button.customID === id) return button;
            }
        }
        return undefined;
    }

    _deserialize(data: any) {
        return this._update(data);
    }

    _update(data: any) {
        if (Array.isArray(data))
            this.rows = data.map(row => new ActionRow(this._client, row));
        else if ('components' in data)
            this.rows = data.components.map(row => new ActionRow(this._client, row));

        for (let i = 0; i < this.rows.length; i++) {
            this.rows[i].parent = this;
            this.rows[i].index = i;
        }

    }
}
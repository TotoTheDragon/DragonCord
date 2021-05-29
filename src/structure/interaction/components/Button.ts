import { Client } from "../../../client/Client";
import { ActionRow } from "./ActionRow";
import { MessageComponent } from "./Component";

export class Button extends MessageComponent {

    style: number; // TODO make enum
    label: string;
    emoji: any; // TODO make emoji interface
    customID?: string;
    url?: string;
    disabled?: boolean;

    index?: number;
    parent?: ActionRow;

    constructor(client: Client, data?: any) {
        super(client, data);

        this.disabled = false;

        if (data)
            this._deserialize(data);
    }

    get xIndex(): number {
        return this.index;
    }

    get yIndex(): number {
        return this.parent?.index;
    }

    serialize(props: string[] = []) {
        return super.serialize([
            "label",
            "style",
            "customID",
            ...props
        ]);
    }

    _deserialize(data: any) {
        return this._update(data);
    }

    _update(data: any) {
        if ('style' in data)
            this.style = data.style;

        if ('label' in data)
            this.label = data.label;

        if ('emoji' in data)
            this.emoji = data.emoji;

        if ('custom_id' in data)
            this.customID = data.custom_id;

        if ('url' in data)
            this.url = data.url;

        if ('disabled' in data)
            this.disabled = data.disabled;
    }
}
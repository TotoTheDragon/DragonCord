import { Client } from "../../client/Client";
import { ChannelType, Snowflake } from "../../util/Constants";
import { TextBasedChannel } from "../interfaces/TextBasedChannel";

export class PrivateChannel extends TextBasedChannel {

    _recipients?: any[];

    recipientID: Snowflake;

    constructor(client: Client, data: any, recipientID: Snowflake) {
        data["type"] = ChannelType.DM;
        super(client, data);
        this._recipients = [{ id: recipientID }];
        if (data != null) this._deserialize(data);
    }

    _deserialize(data: any) {
        if ('recipients' in data) {
            this._recipients = data.recipients;
        }
        super._deserialize(data);
    }

    async fetch(): Promise<any> {
        if (!this.id && this._recipients?.length) this.id = (await this._client.getDMChannel((this as unknown as PrivateChannel)._recipients[0].id)).id;
        return super.fetch();
    }

    get partial(): boolean {
        return this.recipientID != null && this.id != null;
    }
}
import { Client } from "../client/Client";

export class Base {

    readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    _clone() {
        return Object.assign(Object.create(this), this);
    }

    _deserialize(data) {
        return data;
    }

    _update(data) {
        const clone = this._clone(); // Make a clone of this object
        this._deserialize(data); // Update this object
        return clone; // Return the old object
    }

    toString() {
        return `[${this.constructor.name}] ${this.valueOf()}`
    }

    serialize(props: string[] = []): object {
        const json: any = {};
        if (this["id"]) json.id = this["id"];
        for (const prop of props) {
            const value = this[prop];
            const type = typeof value;
            if (value === undefined) continue;
            if (type !== "object" && type !== "function" || value === null) json[prop] = value;
            else if (value.serialize !== undefined) json[prop] = value.serialize(); // Other instance of Base
            else if (value.values !== undefined) json[prop] = [...value.values()]; // Maps and similar objects
            else if (type === "object") json[prop] = value;
        }
        return json;
    }

    valueOf() {
        return this["id"];
    }

}
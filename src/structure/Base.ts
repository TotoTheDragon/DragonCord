import { Client } from "../client/Client";

export class Base {

    readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    /*
        Method to make a deep and shallow clone
    */
    _clone() {
        return Object.assign(Object.create(this), this);
    }

    /*
        Method meant to be overwritten that will update certain values for that class
    */
    _deserialize(data) {
        return data;
    }

    /*
        Update data
    */
    _update(data) {
        const clone = this._clone(); // Make a clone of this object
        this._deserialize(data); // Update this object
        return clone; // Return the old object
    }

    /*
        Overwrite for toString() method
    */
    toString() {
        return `[${this.constructor.name}] ${this.valueOf()}`
    }

    /*
        Turn class into a json object
    */
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

    /*
        Method that gives this classes identifier (meant to be overwritten if its something else than id)
    */
    valueOf() {
        return this["id"];
    }

}
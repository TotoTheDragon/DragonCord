import { EventEmitter } from "events";
import { Client } from "./Client";

export class ClientLogger extends EventEmitter {

    client: Client;

    _debug: boolean;

    constructor(client: Client, debug: boolean) {
        super();
        this.client = client;
        this.debugEnabled = debug;
        this.startListeners("LOG", "WARN", "ERROR");
    }

    disableDebug() {
        this._debug = false;
        this.removeAllListeners("DEBUG");
    }

    enableDebug() {
        this._debug = true;
        this.startListeners("DEBUG");
    }

    set debugEnabled(debug: boolean) {
        debug ? this.enableDebug() : this.disableDebug();
    }

    get debugEnabled() {
        return this._debug;
    }

    startListeners(...args: LogType[]) {
        if (!args.length || args.includes("LOG"))
            this.on("LOG", (type, ...arg) => console.log(`[Shard#${this.client.options.shard || -1}]`, `[${type}]`, ...arg));
        if (!args.length || args.includes("WARN"))
            this.on("WARN", (type, ...arg) => console.warn(`[Shard#${this.client.options.shard || -1}]`, `[${type}]`, ...arg))
        if (!args.length || args.includes("ERROR"))
            this.on("ERROR", (type, ...arg) => console.error(`[Shard#${this.client.options.shard || -1}]`, `[${type}]`, ...arg))
        if (args.includes("DEBUG"))
            this.on("DEBUG", (type, ...arg) => console.debug(`[Shard#${this.client.options.shard || -1}]`, `[${type}]`, ...arg))
    }
}

export type LogType = "LOG" | "WARN" | "ERROR" | "DEBUG";
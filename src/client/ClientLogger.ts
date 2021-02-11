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
            this.on("LOG", (...args) => console.log(`[Shard ${this.client.options.shard || -1}]`, ...args));
        if (!args.length || args.includes("WARN"))
            this.on("WARN", (...args) => console.warn(`[Shard ${this.client.options.shard || -1}]`, ...args))
        if (!args.length || args.includes("ERROR"))
            this.on("ERROR", (...args) => console.error(`[Shard ${this.client.options.shard || -1}]`, ...args))
        if (args.includes("DEBUG"))
            this.on("DEBUG", (...args) => console.debug(`[Shard ${this.client.options.shard || -1}]`, ...args))
    }
}

export type LogType = "LOG" | "WARN" | "ERROR" | "DEBUG";
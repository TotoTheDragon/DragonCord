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
            this.on("LOG", (type, ...arg) => console.log(ConsoleColors.FgBlue + `[Shard#${this.client.options.shard || -1}]`, `[${type}]`, ...(arg.map(a => a?.toString())), ConsoleColors.Reset));
        if (!args.length || args.includes("WARN"))
            this.on("WARN", (type, ...arg) => console.warn(ConsoleColors.FgMagenta + `[Shard#${this.client.options.shard || -1}]`, `[${type}]`, ...(arg.map(a => a?.toString())), ConsoleColors.Reset))
        if (!args.length || args.includes("ERROR"))
            this.on("ERROR", (type, ...arg) => console.error(ConsoleColors.FgRed + `[Shard#${this.client.options.shard || -1}]`, `[${type}]`, ...(arg.map(a => a?.toString())), ConsoleColors.Reset))
        if (args.includes("DEBUG"))
            this.on("DEBUG", (type, ...arg) => console.debug(ConsoleColors.FgYellow + `[Shard#${this.client.options.shard || -1}]`, `[${type}]`, ...(arg.map(a => a?.toString())), ConsoleColors.Reset))
    }
}

export type LogType = "LOG" | "WARN" | "ERROR" | "DEBUG";

export enum ConsoleColors {
    Reset = "\x1b[0m",
    Bright = "\x1b[1m",
    Dim = "\x1b[2m",
    Underscore = "\x1b[4m",
    Blink = "\x1b[5m",
    Reverse = "\x1b[7m",
    Hidden = "\x1b[8m",

    FgBlack = "\x1b[30m",
    FgRed = "\x1b[31m",
    FgGreen = "\x1b[32m",
    FgYellow = "\x1b[38;2;210;190;60m",
    FgBlue = "\x1b[34m",
    FgMagenta = "\x1b[35m",
    FgCyan = "\x1b[36m",
    FgWhite = "\x1b[37m",
}
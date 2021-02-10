import { EventEmitter } from "events";
import { DefaultOptions } from "../util/Constants";
import { Util } from "../util/Util";

export class BaseClient extends EventEmitter {

    private _timeouts: Set<NodeJS.Timeout>;

    private _intervals: Set<NodeJS.Timeout>;

    private _immediates: Set<NodeJS.Immediate>;

    options: ClientOptions;

    constructor(options: ClientOptions = {}) {
        super();

        this._timeouts = new Set();

        this._intervals = new Set();

        this._immediates = new Set();

        this.options = Util.mergeDefault(DefaultOptions, options);
    }

    destroy() {
        for (const t of this._timeouts) this.clearTimeout(t);
        for (const i of this._intervals) this.clearInterval(i);
        for (const i of this._immediates) this.clearImmediate(i);
        this._timeouts.clear();
        this._intervals.clear();
        this._immediates.clear();
    }

    setTimeout(fn: Function, delay: number, ...args: any[]): NodeJS.Timeout {
        const timeout = setTimeout(() => {
            fn(...args);
            this._timeouts.delete(timeout);
        }, delay);
        this._timeouts.add(timeout);
        return timeout;
    }

    clearTimeout(timeout: NodeJS.Timeout) {
        clearTimeout(timeout);
        this._timeouts.delete(timeout);
    }

    setInterval(fn: Function, delay: number, ...args: any[]): NodeJS.Timeout {
        const interval = setInterval(fn, delay, ...args) as unknown as NodeJS.Timeout;
        this._intervals.add(interval);
        return interval;
    }

    clearInterval(interval: NodeJS.Timeout) {
        clearInterval(interval);
        this._intervals.delete(interval);
    }

    setImmediate(fn: (...args: any[]) => void, ...args: any[]): NodeJS.Immediate {
        const immediate = setImmediate(fn, ...args);
        this._immediates.add(immediate);
        return immediate;
    }

    clearImmediate(immediate) {
        clearImmediate(immediate);
        this._immediates.delete(immediate);
    }

}

export interface ClientOptions {
    shard?: number,
    shardCount?: number,
    messageCacheMaxSize?: number,
    messageCacheLifetime?: number,
    messageSweepInterval?: number,
    restWsBridgeTimeout?: number,
    restTimeOffset?: number,
    restRequestTimeout?: number,
    restSweepInterval?: number,
    retryLimit?: number,
    guildCache?: boolean
}
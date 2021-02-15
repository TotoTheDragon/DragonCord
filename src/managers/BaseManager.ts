import { Client } from "../client/Client";
import { Collection } from "@developerdragon/dragoncordapi";
import { DefaultManagerOptions, ManagerOptions } from "../util/Constants";
import { Util } from "../util/Util";
import { Base } from "../structure/Base";

let Structures;

export class BaseManager<K, T extends Base> {

    private readonly _client: Client;
    private readonly _holds: any;
    readonly cache: Collection<K, T>;
    private readonly _options: ManagerOptions;

    constructor(client: Client, holds: any, iterable?: Iterable<T>, options: ManagerOptions = {}) {
        this._client = client;

        if (!Structures) Structures = require("../util/Structures").Structures;
        this._holds = Structures.get(holds.name) || holds;

        this.cache = new Collection(); // Initialize cache

        this._options = Util.mergeDefault(DefaultManagerOptions, options);

        if (iterable) for (const i of iterable) this.cache.set(i.valueOf(), i);
    }

    add(data: any, cache = true, ...extras: any): T {
        if (data === undefined || data === null) return null;
        const existing = this.cache.get(data.id);
        if (existing && existing._update && cache && this._options.cache) existing._update(data);
        if (existing) return existing;
        const value = new this._holds(this._client, data, ...extras);
        if (cache && this._options.cache) this.cache.set(data.id, value);
        return value;
    }

    clearCache() {
        this.cache.clear();
    }

    resolve(idOrInstance: K | T): T {
        if (idOrInstance instanceof this._holds) return idOrInstance as T;
        if (typeof idOrInstance === 'string') return this.cache.get(idOrInstance) || null;
        return null;
    }

    resolveID(idOrInstance: K | T) {
        if (idOrInstance instanceof this._holds) return (idOrInstance as T).valueOf();
        if (typeof idOrInstance === 'string') return idOrInstance;
        return null;
    }

    valueOf() {
        return this.cache;
    }
}
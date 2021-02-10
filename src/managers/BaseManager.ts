import { Client } from "../client/Client";
import { Collection } from "../util/Collection";
import { DefaultManagerOptions, ManagerOptions } from "../util/Constants";
import { Util } from "../util/Util";
import { Base } from "../structure/Base";

let Structures;

export class BaseManager<K, T extends Base> {

    private readonly _client: Client;
    private readonly _holds: any;
    private readonly _cache: Collection<K, T>;
    private readonly _options: ManagerOptions;

    constructor(client: Client, holds: any, iterable?: Iterable<any>, options: ManagerOptions = {}) {
        this._client = client;

        if (!Structures) Structures = require("../util/Structures").Structures;
        this._holds = Structures.get(holds.name);

        this._cache = new Collection(); // Initialize cache

        this._options = Util.mergeDefault(DefaultManagerOptions, options);
    }

    add(data: any, cache = true, ...extras: any): T {
        if (data === undefined || data === null) return null;
        const existing = this._cache.get(data.valueOf());
        if (existing && existing._update && cache && this._options.cache) existing._update(data);
        if (existing) return existing;

        const value = new this._holds(this._client, data, ...extras);
        if (cache && this._options.cache) this._cache.set(data.valueOf(), value);
        return value;
    }

    clearCache() {
        this._cache.clear();
    }

    resolve(idOrInstance: K | T) {
        if (idOrInstance instanceof this._holds) return idOrInstance;
        if (typeof idOrInstance === 'string') return this._cache.get(idOrInstance) || null;
        return null;
    }

    resolveID(idOrInstance: K | T) {
        if (idOrInstance instanceof this._holds) return (idOrInstance as T).valueOf();
        if (typeof idOrInstance === 'string') return idOrInstance;
        return null;
    }

    valueOf() {
        return this._cache;
    }
}
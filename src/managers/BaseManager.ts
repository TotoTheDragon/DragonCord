import { Cache } from "@developerdragon/advancedcache";
import { Client } from "../client/Client";
import { Base } from "../structure/Base";
import { DefaultManagerOptions, ManagerOptions } from "../util/Constants";
import { Util } from "../util/Util";

let Structures;

export abstract class BaseManager<T extends Base> {

    protected readonly _client: Client;
    private readonly _holds: any;
    protected readonly _cache: Cache<T>;
    private readonly _options: ManagerOptions;

    constructor(client: Client, holds: any, options: ManagerOptions = {}, iterable?: Iterable<T>) {
        this._client = client;

        if (!Structures) Structures = require("../util/Structures").Structures;
        this._holds = Structures.get(holds.name) || holds;

        this._options = Util.mergeDefault(DefaultManagerOptions, options);

        this._cache = new Cache(this._options.cacheOptions); // Initialize cache

        if (iterable)
            for (const iter of iterable) this._cache.add(iter.valueOf(), iter);
    }

    onAdd(object: T) { };
    onUpdate(newObject: T) { };

    add(data: any, cache = true, ...extras: any): T {
        if (data === undefined || data === null) return null;
        const existing = this._cache.get(data.id) as T;
        if (existing && existing._update && cache && this._options.cache) {
            existing._update(data);
            this.onUpdate(existing);
        }
        if (existing) return existing;
        const value = new this._holds(this._client, data, ...extras);
        if (cache && this._options.cache) this._cache.add(data.id, value);
        this.onAdd(value);
        return value;
    }

    clearCache() {
        this._cache.clear();
    }

    resolve(idOrInstance: string | T): T {
        if (idOrInstance instanceof this._holds) return idOrInstance as T;
        if (typeof idOrInstance === 'string') return this._cache.get(idOrInstance) as T || null;
        return null;
    }

    resolveID(idOrInstance: string | T) {
        if (idOrInstance instanceof this._holds) return (idOrInstance as T).valueOf();
        if (typeof idOrInstance === 'string') return idOrInstance;
        return null;
    }

    valueOf() {
        return this._cache;
    }
}
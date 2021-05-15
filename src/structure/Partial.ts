import { Snowflake } from "../util/Constants";

/*
    Base
*/
export interface Partial {
    fetch(opts?: FetchOptions): Promise<Partial>;
}

export interface FetchOptions {
    cache?: boolean;
}

/*
    Manager
*/
export interface PartialManager {
    createPartial(id: Snowflake, opts?: PartialCreateOptions, data?: any): Partial;
}

export interface PartialCreateOptions {
    cache?: boolean
}
import { Snowflake } from "./Constants";

const EPOCH = 1420070400000;

export class SnowflakeUtil {

    constructor() {
        throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
    }

    static deconstruct(snowflake): DeconstructedSnowflake {
        const BINARY = BigInt(snowflake).toString(2).padStart(64, '0');
        const res = {
            timestamp: parseInt(BINARY.substring(0, 42), 2) + EPOCH,
            workerID: parseInt(BINARY.substring(42, 47), 2),
            processID: parseInt(BINARY.substring(47, 52), 2),
            increment: parseInt(BINARY.substring(52, 64), 2),
            binary: BINARY,
        };
        Object.defineProperty(res, 'date', {
            get: function get() {
                return new Date(this.timestamp);
            },
            enumerable: true,
        });
        return res as DeconstructedSnowflake;
    }

    static findShard(id: Snowflake, shardCount: number): number {
        return (parseInt(id) >> 22) % shardCount;
    }

    static get EPOCH() {
        return EPOCH;
    }
}

export interface DeconstructedSnowflake {
    timestamp: number,
    workerID: number,
    processID: number,
    increment: number,
    binary: string,
    date: Date
}
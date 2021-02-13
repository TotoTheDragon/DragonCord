import { Snowflake } from "./Constants";

const EPOCH = 1420070400000;
let INCREMENT = 0;

export class SnowflakeUtil {

    constructor() {
        throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
    }

    static generate(timestamp: any = Date.now()) {
        if (timestamp instanceof Date) timestamp = timestamp.getTime();
        if (typeof timestamp !== 'number' || isNaN(timestamp)) {
            throw new TypeError(
                `"timestamp" argument must be a number (received ${isNaN(timestamp) ? 'NaN' : typeof timestamp})`,
            );
        }
        if (INCREMENT >= 4095) INCREMENT = 0;
        const BINARY = `${(timestamp - EPOCH).toString(2).padStart(42, '0')}0000100000${(INCREMENT++)
            .toString(2)
            .padStart(12, '0')}`;
        return SnowflakeUtil.binaryToID(BINARY);
    }

    static deconstruct(snowflake): DeconstructedSnowflake {
        const BINARY = SnowflakeUtil.idToBinary(snowflake).toString(2).padStart(64, '0');
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

    static idToBinary(num): number {
        let bin = '';
        let high = parseInt(num.slice(0, -10)) || 0;
        let low = parseInt(num.slice(-10));
        while (low > 0 || high > 0) {
            bin = String(low & 1) + bin;
            low = Math.floor(low / 2);
            if (high > 0) {
                low += 5000000000 * (high % 2);
                high = Math.floor(high / 2);
            }
        }
        return parseInt(bin);
    }

    static binaryToID(num) {
        let dec = '';

        while (num.length > 50) {
            const high = parseInt(num.slice(0, -32), 2);
            const low = parseInt((high % 10).toString(2) + num.slice(-32), 2);

            dec = (low % 10).toString() + dec;
            num =
                Math.floor(high / 10).toString(2) +
                Math.floor(low / 10)
                    .toString(2)
                    .padStart(32, '0');
        }

        num = parseInt(num, 2);
        while (num > 0) {
            dec = (num % 10).toString() + dec;
            num = Math.floor(num / 10);
        }

        return dec;
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
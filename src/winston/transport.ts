import { transports } from "winston";
import * as Transport from "winston-transport";
import { format, ConsoleFormatOptions } from "./formatter";
export function transport(options?: ConsoleFormatOptions): Transport {
    return new transports.Console({
        format: format(options),
        handleExceptions: true,
        handleRejections: true
    });
}
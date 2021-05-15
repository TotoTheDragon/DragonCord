import winston, { LeveledLogMethod, LogCallback, Logger, LoggerOptions } from "winston";

type LogLevel =
    | 'error'
    | 'warn'
    | 'info'
    | 'debug'
    | 'http'
    | 'verbose'
    | 'input'
    | 'silly'

export function createLogger(options?: LoggerOptions): Logger {
    return init(winston.createLogger(options));
}

function createPatchedLogger(logger: Logger, level: LogLevel): LeveledLogMethod {

    function logMethod(message: string, callback: LogCallback): Logger
    function logMethod(message: string, meta: any, callback: LogCallback): Logger
    function logMethod(message: string, ...meta: any[]): Logger
    function logMethod(message: any): Logger
    function logMethod(infoObject: Record<string, unknown>): Logger

    function logMethod(...args: any[]): Logger {
        return logger[level](args.shift(), { _callee: getCallee() }, ...args)
    }

    return logMethod
}

function createNonPatchedLogger(logger: Logger, level: LogLevel): LeveledLogMethod {

    function logMethod(message: string, callback: LogCallback): Logger
    function logMethod(message: string, meta: any, callback: LogCallback): Logger
    function logMethod(message: string, ...meta: any[]): Logger
    function logMethod(message: any): Logger
    function logMethod(infoObject: Record<string, unknown>): Logger

    function logMethod(...args: any[]): Logger {
        return logger[level](args.shift(), ...args);
    }

    return logMethod;
}

export function init(logger: Logger): Logger {
    const patchedLogger: Logger = { ...logger } as Logger
    patchedLogger.add = logger.add.bind(logger)

    patchedLogger.error = createPatchedLogger(logger, 'error')
    patchedLogger.warn = createPatchedLogger(logger, 'warn')
    patchedLogger.info = createNonPatchedLogger(logger, 'info')
    patchedLogger.debug = createPatchedLogger(logger, 'debug')
    patchedLogger.http = createPatchedLogger(logger, 'http')
    patchedLogger.verbose = createPatchedLogger(logger, 'verbose')
    patchedLogger.input = createPatchedLogger(logger, 'input')
    patchedLogger.silly = createPatchedLogger(logger, 'silly')
    return patchedLogger
}

export function getCallee(): Callee {
    try {
        throw new Error()
    } catch (e) {
        const line = e.stack.split('\n')[3].replace(/\\/g, "/") || ''
        return parseLineToCallee(line);
    }
}

export function parseLineToCallee(line: string): Callee {
    const functionNameMatch = line.match(/\w+@|at (([^(]+)) \(.*/)
    const functionName = (functionNameMatch && functionNameMatch[1]) || ''

    const result = line.match(/(\/[^:]+):([0-9]+):[0-9]+/)
    const filePath = result[1] || ''
    const lineNumber = result[2] || ''

    return {
        functionName,
        lineNumber,
        filePath,
    }
}

export interface Callee {
    functionName: string
    lineNumber: string
    filePath: string
}
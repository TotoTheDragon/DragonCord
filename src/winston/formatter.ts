import colors from "colors/safe";
import { Format, TransformableInfo } from "logform";
import { inspect } from "util";
import winston from "winston";
import { Callee, parseLineToCallee } from "./patch";
const { SPLAT, MESSAGE } = require('triple-beam');

export class ConsoleFormat implements Format {

    private static readonly reSpaces = /^\s+/
    private static readonly reSpacesOrEmpty = /^(\s*)/
    private static readonly reColor = /\x1B\[\d+m/

    private static readonly chars = {
        singleLine: '▪',
        startLine: '┏',
        line: '┃',
        endLine: '┗',
    }

    constructor(options?: ConsoleFormatOptions) {
    }

    private inspect = (value: any, metaLines: string[]): void =>
        inspect(value, { colors: true, sorted: false, compact: false, showHidden: false })
            .split('\n')
            .forEach((line) => metaLines.push(line));

    private getColor = (info: TransformableInfo): string => info.level.match(ConsoleFormat.reColor)?.[0] ?? "";

    private getPadding = (info: TransformableInfo): string => info.message.match(ConsoleFormat.reSpaces)?.[0] ?? "";

    private getTags = (info: TransformableInfo): string[] => info.tags || [];

    private getStackLines(info: TransformableInfo): string[] {
        const stackLines: string[] = []

        if (info.stack) {
            const error = new Error()
            error.stack = info.stack
            this.inspect(error, stackLines)
        }

        return stackLines;
    }



    private getObjectLines(info: TransformableInfo): string[] {
        const metaLines: string[] = []

        for (const obj of info.objects)
            this.inspect(obj, metaLines)

        return metaLines
    }

    private getMessage(info: TransformableInfo, char: string, color: string): string {
        let message = info.message;

        message = message.replace(
            ConsoleFormat.reSpacesOrEmpty,
            `$1${color}${colors.dim(char)}${colors.reset(' ')}`
        )

        return `${info.level}:${message}`
    }

    private getMs(info: TransformableInfo): string {
        return info.ms
            ? colors.italic(colors.dim(` ${info.ms}`))
            : "";
    }

    private getTimestamp(info: TransformableInfo): string {
        return info.timestamp
            ? colors.italic(colors.dim(new Date(info.timestamp).toLocaleString()))
            : "";
    }

    private getCallee(info: TransformableInfo): Callee {
        const callee: Callee = info?._callee ?? {};

        if (callee?.filePath)
            callee.filePath = callee.filePath.replace(/^.*\/src\//, '');

        return callee;
    }

    private getLinePrefix(level: string, padding: string, char: string, color: string): string {
        return `${colors.dim(level)}:${padding}${color}${colors.dim(char)}`;
    }

    private getChar(end: boolean): string {
        if (end)
            return ConsoleFormat.chars["endLine"];
        return ConsoleFormat.chars["line"];
    }

    private getFirstChar(multiple: boolean): string {
        if (multiple)
            return ConsoleFormat.chars["startLine"];
        return ConsoleFormat.chars["singleLine"];
    }

    private write(info: TransformableInfo, tags: string[], metaLines: string[], color: string, callee: Callee): void {
        const padding = this.getPadding(info);

        info[MESSAGE] += colors.dim(` (${this.getTimestamp(info)})`);

        const linePrefix = this.getLinePrefix(info.level, padding, this.getChar(!(metaLines.length > 0 || tags.length > 0)), color);

        if (callee.filePath) {
            const filePath = ` at ${callee?.filePath}:${callee?.lineNumber}`
            const functionName = callee.functionName
                ? ` [${callee.functionName}]`
                : ''

            info[MESSAGE] += "\n";
            info[MESSAGE] += linePrefix;
            info[MESSAGE] += colors.dim(colors.italic(`${filePath}${functionName}`));
            info[MESSAGE] += colors.reset(' ');
        }

        if (tags.length) {
            info[MESSAGE] += "\n";
            info[MESSAGE] += linePrefix;
            info[MESSAGE] += colors.dim(` Tags: ${tags.join(", ")}`);
            info[MESSAGE] += colors.reset(' ');
        }

        const numberLength = metaLines.length.toString().length;

        metaLines.forEach((line, lineNumberIndex) => {
            const lineNumber = colors.dim((lineNumberIndex + 1).toString().padStart(numberLength, ' '))
            const chr = this.getChar(lineNumberIndex === metaLines.length - 1)

            info[MESSAGE] += "\n";
            info[MESSAGE] += this.getLinePrefix(info.level, padding, chr, color);
            info[MESSAGE] += colors.reset(` [${lineNumber}] ${line}`);
        })

        info[MESSAGE] += "\n";

    }

    transform(info: TransformableInfo): TransformableInfo {
        const tags: string[] = this.getTags(info);

        const metaLines: string[] = [
            ...this.getStackLines(info),
            ...this.getObjectLines(info)
        ]

        const callee = this.getCallee(info);

        const color = this.getColor(info);

        info[MESSAGE] = this.getMessage(
            info,
            this.getFirstChar((tags.length > 0 || metaLines.length > 0 || callee?.filePath != null)),
            color
        );
        info[MESSAGE] += this.getMs(info);

        this.write(info, tags, metaLines, color, callee);

        return info;
    }


}

export class MetaFormat implements Format {
    transform(info: TransformableInfo): TransformableInfo {
        const tags = [];
        const objects = [];

        if (info[SPLAT]?.[0]._callee)
            info[SPLAT].shift();

        if (typeof info[SPLAT]?.[Symbol.iterator] === 'function')
            for (const meta of info[SPLAT]) {
                switch (typeof meta) {
                    case "object":
                        objects.push(meta);
                        break;
                    case "string":
                    case "number":
                    case "symbol":
                        tags.push(meta.toString());
                        break;
                }
            }

        info.tags = tags;
        info.objects = objects;
        return info;
    }
}
export class UncaughtFormatter implements Format {
    transform(info: TransformableInfo): TransformableInfo {

        if ("exception" in info && "error" in info) {
            info[MESSAGE] = info.error.message;
            info.message = info.error.message;

            info._callee = parseLineToCallee(info.error.stack.split('\n')[1].replace(/\\/g, "/") || '');
        }


        return info;
    }
}

export function format(opts?: ConsoleFormatOptions): Format {
    return winston.format.combine(
        new UncaughtFormatter(),
        winston.format.timestamp(),
        winston.format.ms(),
        new MetaFormat(),
        winston.format.errors({ stack: true }),
        winston.format.colorize({ all: true }),
        winston.format.padLevels(),
        new ConsoleFormat(opts)
    );
}

export interface ConsoleFormatOptions {
}


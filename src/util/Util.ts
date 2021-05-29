import { Client } from "../client/Client";
import { CustomError } from "../errors/CustomError";
import { ActionRow } from "../structure/interaction/components/ActionRow";
import { Button } from "../structure/interaction/components/Button";
import { MessageComponent } from "../structure/interaction/components/Component";
import { Colors, ImageFormats, ImageSizes } from "./Constants";

const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const isObject = d => typeof d === 'object' && d !== null;

export class Util {

    static mergeDefault(def: object, given: object): object {
        if (!given) return def;
        for (const key in def) {
            if (!has(given, key) || given[key] === undefined) {
                given[key] = def[key];
            } else if (given[key] === Object(given[key])) {
                given[key] = Util.mergeDefault(def[key], given[key]);
            }
        }
        return given;
    }

    static makeImageUrl(root: string, { format = 'webp', size = undefined } = {}): string {
        if (format && !ImageFormats.includes(format)) throw new CustomError("INVALID_IMAGE_FORMAT", format);
        if (size && !ImageSizes.includes(size)) throw new CustomError("INVALID_IMAGE_SIZE", size);
        return `${root}.${format}${size ? `?size=${size}` : ''}`;
    }

    static resolveColor(color) {
        if (typeof color === 'string') {
            if (color === 'RANDOM') return Math.floor(Math.random() * (0xffffff + 1));
            if (color === 'DEFAULT') return 0;
            color = Colors[color] || parseInt(color.replace('#', ''), 16);
        } else if (Array.isArray(color)) {
            color = (color[0] << 16) + (color[1] << 8) + color[2];
        }

        if (color < 0 || color > 0xffffff) throw new RangeError('COLOR_RANGE');
        else if (color && isNaN(color)) throw new TypeError('COLOR_CONVERT');

        return color;
    }

    static cloneObject(obj) {
        return Object.assign(Object.create(obj), obj);
    }

    static toArray(input: any): any[] {
        return Array.isArray(input) ? input : Array.of(input);
    }

    static createMessageComponent(client: Client, data: any): MessageComponent {
        if (data.type === 1) return new ActionRow(client, data);
        if (data.type === 2) return new Button(client, data);
        return undefined;
    }
}
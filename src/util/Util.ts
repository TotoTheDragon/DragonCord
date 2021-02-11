import { CustomError } from "../errors/CustomError";
import { ImageFormats, ImageSizes } from "./Constants";

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

    static parseEndpoint(endpoint: string, args: object): string {
        Object
            .keys(args)
            .forEach(key => {
                endpoint = endpoint.replace(new RegExp(`:${key}`, "g"), args[key]);
            })
        return endpoint;
    }

    static makeImageUrl(root: string, { format = 'webp', size = undefined } = {}): string {
        if (format && !ImageFormats.includes(format)) throw new CustomError("INVALID_IMAGE_FORMAT", format);
        if (size && !ImageSizes.includes(size)) throw new CustomError("INVALID_IMAGE_SIZE", size);
        return `${root}.${format}${size ? `?size=${size}` : ''}`;
    }
}
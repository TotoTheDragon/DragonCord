import { Client } from "../client/Client";
import { APIRequest } from "./APIRequest";

const noop = () => { };

const methods = ["get", "post", "patch", "put", "delete"]
const reflectors = ["toString", "valueOf", "inspect", "constructor"];
export function requestBuilder(client: Client) {
    const route = [''];
    const handler = {
        get(target, name) {
            if (reflectors.includes(name)) return route.join("/");
            if (methods.includes(name)) return () => new APIRequest(client, name.toString().toUpperCase(), route.join("/"));
            else route.push(name);
            return new Proxy(noop, handler);
        },
        apply(target, _, args) {
            route.push(...args.filter(x => x != null && x != undefined));
            return new Proxy(noop, handler);
        }
    }
    return new Proxy(noop, handler);
}
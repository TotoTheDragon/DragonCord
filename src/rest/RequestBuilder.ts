import { Client } from "../client/Client";

const noop = () => { };

const methods = ["get", "post", "patch", "put", "delete"]
const reflectors = ["toString", "valueOf", "inspect", "constructor"];
export function requestBuilder(client: Client) {
    const route = [''];
    let method = undefined;
    let body = undefined;
    const handler = {
        get(target, name) {
            if (name === "make") return () => client.requestHandler.request(
                method,
                route.join("/"),
                true,
                body,
                undefined
            )
            if (reflectors.includes(name)) return route.join("/");
            if (methods.includes(name)) method = name;
            else route.push(name);
            return new Proxy(noop, handler);
        },
        apply(target, _, args) {
            if (method) body = args[0];
            else route.push(...args.filter(x => x != null && x != undefined));
            return new Proxy(noop, handler);
        }
    }
    return new Proxy(noop, handler);
}
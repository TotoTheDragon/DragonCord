import { Client } from "../client/Client";

const noop = () => { };

const methods = ["get", "post", "patch", "put", "delete"]
const reflectors = ["toString", "valueOf", "inspect", "constructor"];
export function routeBuilder(client: Client) {
    const route = [''];
    const handler = {
        get(target, name) {
            if (reflectors.includes(name)) return route.join("/");
            if (methods.includes(name)) {
                return () => client.requestHandler.request(
                    name,
                    route.join("/"),
                    true,
                    undefined,
                    undefined
                )
            }
            route.push(name);
            return new Proxy(noop, handler);
        },
        apply(target, _, args) {
            route.push(...args.filter(x => x != null));
            return new Proxy(noop, handler);
        }
    }
    return new Proxy(noop, handler);
}
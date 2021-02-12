import { request } from "https";
import { IncomingMessage } from "http";
import { createGunzip, createInflate } from "zlib";
import { Client } from "../client/Client";
import { AsyncError } from "../errors/AsyncError";
import { Base } from "../structure/Base";
import { Method, REST_VERSION, Urls } from "../util/Constants";

export class RequestHandler extends Base {

    baseURL: string;
    userAgent: string;


    constructor(client: Client) {
        super(client);

        this.baseURL = Urls.Base + REST_VERSION;
        this.userAgent = `DiscordBot (https://github.com/TotoTheDragon/DragonCord, ${require("../../package.json").version})`;
    }

    async request(method: Method, url: string, auth: boolean, body: any, file: any, _route?: string, prioritize?: boolean): Promise<object> {
        this.client.logger.emit("DEBUG", "REQUEST", method, url, JSON.stringify(body) || "");
        const route = _route || this.routefy(url, method);

        const stack = new Error().stack.substring(7);

        return new Promise((resolve, reject) => {

            const headers = {};
            headers["User-Agent"] = this.userAgent;
            headers["Accept-Encoding"] = "gzip,deflate";
            let data;
            let finalURL = url;

            try {

                if (auth) headers["Authorization"] = `Bot ${this.client.options.token}`;

                if (body && body.reason) headers["X-Audit-Log-Reason"] = body.reason;
                // if (body && body.reason && method !== "POST" || !url.includes("/prune")) delete body.reason;

                if (file) {

                } else if (body) {
                    if (method === "GET" || method === "DELETE") {
                        let qs = "";
                        Object.keys(body).forEach(key => {
                            if (body[key] === undefined) return;
                            if (Array.isArray(body[key]))
                                body[key].forEach(val => qs += `&${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
                            else qs += `&${encodeURIComponent(key)}=${encodeURIComponent(body[key])}`
                        })
                        finalURL += "?" + qs.substring(1);
                    } else {
                        data = JSON.stringify(body);
                        headers["Content-Type"] = "application/json";
                    }
                }

            } catch (err) {
                reject(err);
                return;
            }

            const req = request({
                method: method,
                host: Urls.Client,
                path: this.baseURL + finalURL,
                headers: headers
            });


            let reqError;

            req.once("abort", () => {
                reqError = reqError || new Error(`Request aborted by client on ${method} ${url}`);
                reqError.req = req;
                reject(reqError);
            }).once("error", (err) => {
                reqError = err;
                req.destroy();
            })

            let latency = Date.now();

            req.once("response", (resp) => {
                latency = Date.now() - latency;

                resp.once("aborted", () => {
                    reqError = reqError || new Error(`Request aborted by server on ${method} ${url}`);
                    reqError.req = req;
                    reject(reqError);
                });

                let response: any = "";

                let _respStream = resp;

                if (resp.headers["content-encoding"])
                    if (resp.headers["content-encoding"].includes("gzip"))
                        _respStream = resp.pipe(createGunzip()) as unknown as IncomingMessage;
                    else if (resp.headers["content-encoding"].includes("deflate"))
                        _respStream = resp.pipe(createInflate()) as unknown as IncomingMessage;

                _respStream
                    .on("data", str => response += str)
                    .on("error", err => {
                        reqError = err;
                        req.destroy();
                    })
                    .once("end", () => {
                        const now = Date.now();

                        if (resp.statusCode !== 429) { }; // console.log(`${!!body && !!body.content} ${now} ${route} ${resp.statusCode}: ${latency}ms `)

                        if (resp.statusCode >= 300) {
                            if (resp.statusCode === 429) return console.log("Encountered ratelimit")
                            else if (resp.statusCode === 502) return console.log("Cloudflare");


                            if (response.length > 0 && resp.headers["content-type"] === "application/json")
                                try {
                                    response = JSON.parse(response);
                                } catch (err) {
                                    reject(err);
                                    return;
                                }

                            if (response.code) reject(new AsyncError(resp.statusMessage, "DiscordRESTError", stack));
                            else reject(new AsyncError(resp.statusMessage, "DiscordHTTPError", stack));

                            return;
                        }

                        if (response.length > 0 && resp.headers["content-type"] === "application/json")
                            try {
                                response = JSON.parse(response);
                            } catch (err) {
                                reject(err);
                                return;
                            }

                        resolve(response);
                    });


            });

            req.setTimeout(30000, () => {
                reqError = new AsyncError("Request timed out", "TimeoutError", stack);
                req.destroy();
            });
            if (Array.isArray(data)) {
                for (const chunk of data) req.write(chunk);
                req.end();
            } else req.end(data);

        });
    }

    routefy(url: string, method: Method) {
        let route = url.replace(/\/([a-z-]+)\/(?:[0-9]{17,19})/g, function (match, p) {
            return p === "channels" || p === "guilds" || p === "webhooks" ? match : `/${p}/:id`;
        }).replace(/\/reactions\/[^/]+/g, "/reactions/:id").replace(/^\/webhooks\/(\d+)\/[A-Za-z0-9-_]{64,}/, "/webhooks/$1/:token");
        if (method === "DELETE" && route.endsWith("/messages/:id"))  // Delete Messsage endpoint has its own ratelimit
            route = method + route;
        return route;
    }

    valueOf() {
        return this;
    }
}
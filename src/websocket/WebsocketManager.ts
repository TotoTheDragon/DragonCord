import { EventEmitter } from "events";
import WebSocket from "ws";
import { Client } from "../client/Client";
import { handlers } from "./handlers";

export class WebsocketManager extends EventEmitter {

    ws: WebSocket
    heartbeatInterval: number;
    lastSequence: number;
    receivedAck: boolean;

    session: string;

    client: Client;

    constructor(client: Client) {
        super();

        Object.defineProperty(this, 'client', { value: client });

        this.heartbeatInterval = -1;
        this.lastSequence = null;
    }

    async connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket("wss://gateway.discord.gg/?v=8&encoding=json");
                this.ws.on("message", (data) => {
                    const request: DiscordGatewayPayload = JSON.parse(data.toString());
                    const { t, op } = request;
                    switch (op) {
                        case 0:
                            if (handlers[t]) handlers[t](this.client, request, this.client.options.shard);
                            else console.log(`SHARD #${this.client.options.shard}:`, request);
                            break;
                        case 10:
                            console.log("Bot connected");
                            this.heartbeatInterval = request.d.heartbeat_interval;
                            this.startHeartbeats();
                            resolve();
                            break;
                        case 11:
                            this.receivedAck = true;
                            break;
                        default:
                            console.log(request);
                            break;
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    startHeartbeats() {
        if (this.heartbeatInterval === -1) throw Error("Not yet connected to discord, but tried to start heartbeats");
        this.receivedAck = true;
        setInterval(() => {
            if (this.receivedAck === false) throw new Error("Did not receive heartbeat ack between requests");
            console.log("Sent heartbeat");
            this.ws.send(JSON.stringify({ "op": 1, "d": this.lastSequence }));
        }, this.heartbeatInterval);
    }

    async sendIdentify(token: string, intent: number = 13951) {
        this.ws.send(
            JSON.stringify(
                {
                    "op": 2,
                    "d": {
                        "token": token,
                        "intents": intent,
                        "properties": {
                            "$os": "windows",
                            "$browser": "dragoncord",
                            "$device": "dragoncord"
                        },
                        "shard": [this.client.options.shard, this.client.options.shardCount]
                    }
                }
            )
        )
    }
}

export interface DiscordGatewayPayload {
    t: string,
    s: number,
    op: number,
    d: any
}
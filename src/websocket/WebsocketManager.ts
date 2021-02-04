import WebSocket from "ws";

export class WebsocketManager {

    ws: WebSocket
    heartbeatInterval: number;
    lastSequence: number;
    receivedAck: boolean;

    constructor() {
        this.heartbeatInterval = -1;
        this.lastSequence = null;
    }

    async connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket("wss://gateway.discord.gg/?v=8&encoding=json");
                this.ws.on("open", () => {
                    console.log("Websocket opened");
                    console.log(this.ws)

                });
                this.ws.on("ping", (data) => console.log(`Ping: `, data));
                this.ws.on("pong", (data) => console.log(`Pong: `, data));
                this.ws.on("message", (data) => {
                    const request: DiscordRequest = JSON.parse(data.toString());
                    console.log(`Message: `, request);
                    if (request.op === 10) {
                        console.log("Bot started");
                        this.heartbeatInterval = request.d.heartbeat_interval;
                        this.startHeartbeats();
                        return;
                    }
                    if (request.op === 11) {
                        this.receivedAck = true;
                        return;
                    }
                });
                this.ws.on("upgrade", (req) => {
                    console.log(`Upgraded to websocket`);
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
            if(this.receivedAck === false) throw new Error("Did not receive heartbeat ack between requests");
            console.log("Sent heartbeat");
            this.ws.send(JSON.stringify({ "op": 1, "d": this.lastSequence }));
        }, this.heartbeatInterval);
    }
}

export interface DiscordRequest {
    t: string,
    s: number,
    op: number,
    d: any
}
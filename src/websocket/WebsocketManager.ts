import { EventEmitter } from "events";
import WebSocket from "ws";
import { Client } from "../client/Client";
import { GatewayOPCodes } from "../util/Constants";
import { handlers } from "./handlers";

export class WebsocketManager extends EventEmitter {

    ws: WebSocket
    heartbeatInterval: number;
    lastReceivedSequence: number;
    sequence: number;
    receivedAck: boolean;

    session: string;

    client: Client;

    constructor(client: Client) {
        super();

        this.client = client;

        this.heartbeatInterval = -1;
        this.sequence = 0;
        this.lastReceivedSequence = null;

        this._onWSMessage = this._onWSMessage.bind(this);
        this._onWSClose = this._onWSClose.bind(this);
        this._onWSError = this._onWSError.bind(this);
        this._onWSOpen = this._onWSOpen.bind(this);
    }

    sendPacket(op: GatewayOPCodes, d: any, t?: string) {
        this.send(JSON.stringify({ op, d, t }));
    }

    send(data: any) {
        this.ws.send(data);
        this.sequence++;
    }

    async connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket("wss://gateway.discord.gg/?v=8&encoding=json");
                this.initializeWS();
                this.on("hello", resolve);
            } catch (err) {
                reject(err);
            }
        });
    }

    initializeWS() {

        if (!this.client.options.token)
            return this.disconnect();

        this.ws = new WebSocket("wss://gateway.discord.gg/?v=8&encoding=json");

        this.ws.on("open", this._onWSOpen);
        this.ws.on("message", this._onWSMessage);
        this.ws.on("error", this._onWSError);
        this.ws.on("close", this._onWSError);
    }

    disconnect(reconnect?: boolean, error?: Error) {
        if (!this.ws)
            return;

        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }

        if (this.ws.readyState !== WebSocket.CLOSED) {

            this.ws.removeEventListener("close", this._onWSClose);

            try {

            } catch (err) {
                this.emit("error", err);
            }

        }

        this.ws = null;

    }

    _onWSOpen() {

    }

    _onWSMessage(data) {
        const request: DiscordGatewayPayload = JSON.parse(data.toString());
        const { t, op, s } = request;
        this.lastReceivedSequence = s ?? this.lastReceivedSequence ?? 0;
        switch (op) {
            case GatewayOPCodes.EVENT:
                if (handlers[t]) handlers[t](this.client, request, this.client.options.shard);
                else this.client.logger.debug("Unhandled websocket event", "websocket", "event", request);
                break;
            case GatewayOPCodes.HELLO:
                this.heartbeatInterval = request.d.heartbeat_interval;
                this.startHeartbeats();
                this.client.logger.debug("Bot connected to websocket", "websocket", "connection", request.d);
                this.emit("hello");
                break;
            case GatewayOPCodes.ACK:
                this.receivedAck = true;
                break;
            default:
                this.client.logger.debug("Unhandled payload", "websocket", request);
                break;
        }
    }

    _onWSError() {

    }

    _onWSClose() {

    }

    startHeartbeats() {
        if (this.heartbeatInterval === -1) throw Error("Not yet connected to discord, but tried to start heartbeats");
        this.receivedAck = true;
        setInterval(() => {
            if (!this.receivedAck) throw new Error("Did not receive heartbeat ack between requests");
            this.client.logger.debug("Executed heartbeat", "websocket", { "seq": this.lastReceivedSequence });
            this.sendPacket(GatewayOPCodes.HEARTBEAT, this.lastReceivedSequence);
        }, this.heartbeatInterval);
    }

    async sendIdentify(token: string, intents: number = 528) {
        this.sendPacket(
            GatewayOPCodes.IDENTIFY,
            {
                token,
                intents,
                properties: {
                    $os: "windows",
                    $browser: "dragoncord",
                    $device: "dragoncord"
                },
                shard: [this.client.options.shard, this.client.options.shardCount]
            }
        )
    }
}

export interface DiscordGatewayPayload {
    t: string,
    s: number,
    op: number,
    d: any
}
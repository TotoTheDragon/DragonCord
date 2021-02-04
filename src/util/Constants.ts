import { ClientOptions } from "../client/BaseClient";

export const DefaultOptions: ClientOptions = {
    shardCount: 1,
    messageCacheMaxSize: 200,
    messageCacheLifetime: 0,
    messageSweepInterval: 0,
    restWsBridgeTimeout: 5000,
    restRequestTimeout: 15000,
    retryLimit: 1,
    restTimeOffset: 500,
    restSweepInterval: 60
}
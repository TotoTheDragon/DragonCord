import { WebsocketManager } from "./websocket/WebsocketManager";



async function start(): Promise<void> {

    return new Promise(resolve => {
        const manager: WebsocketManager = new WebsocketManager();
        try {
            manager.connect();
            manager.ws.on("close", () => {
                console.log("Closing websocket");
                resolve()
            });
        } catch (err) {
            console.log(err)
        }
    })


}

start();
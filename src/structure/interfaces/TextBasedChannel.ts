import { requestBuilder } from "../../rest/RequestBuilder";
import { Channel } from "../Channel";

export class TextBasedChannel extends Channel {

    async send(content: string) {
        return requestBuilder(this.client)
            .channels(this.id)
            .messages()
            .post({ content })
            .make();
    }

    static applyToClass(structure, full = false, ignore = []) {
        const props = ['send'];
        if (full) {
            props.push(
                'lastMessage',
                'lastPinAt',
                'bulkDelete',
                'startTyping',
                'stopTyping',
                'typing',
                'typingCount',
                'createMessageCollector',
                'awaitMessages',
            );
        }
        for (const prop of props) {
            if (ignore.includes(prop)) continue;
            if (prop === undefined) continue;
            if (Object.getOwnPropertyDescriptor(TextBasedChannel.prototype, prop) === undefined) continue;
            Object.defineProperty(
                structure.prototype,
                prop,
                Object.getOwnPropertyDescriptor(TextBasedChannel.prototype, prop),
            );
        }
    }

}
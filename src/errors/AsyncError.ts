import { CustomError } from "./CustomError";

export class AsyncError extends CustomError {

    constructor(message: string, name: string, stack: string) {
        super(name, message);
        if (stack.startsWith("Error:")) stack = stack.substring(7);
        this.stack = this.stack + "\n" + stack;
    }

}
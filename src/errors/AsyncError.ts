export class AsyncError extends Error {

    constructor(message: string, name: string, stack: string) {
        super(message);
        this.name = name;
        if (stack.startsWith("Error:")) stack = stack.substring(7);
        this.stack = this.stack + "\n" + stack;
    }

}
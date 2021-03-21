import { readFile, writeFile } from "fs/promises";

export class DCFile {

    name: string;
    file: Buffer;

    constructor(arg1: string | Buffer, arg2?: Buffer) {
        if (typeof arg1 === "string") {
            this.name = arg1;
            this.file = arg2;
        } else {
            this.file = arg1;
        }
    }

    save(path: string): Promise<any> {
        return writeFile(`${path}/${this.name}`, this.file);
    }

    static async fromFile(path: string): Promise<any> {

        return new DCFile(path.replace(/\\/g, "/").split("/").pop(), await readFile(path));
    }

}
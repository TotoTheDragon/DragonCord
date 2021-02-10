export class Structures {

    constructor() {
        throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
    }

    static get(structure) {
        if (typeof structure === 'string') return structures[structure];
        throw new TypeError(`"structure" argument must be a string (received ${typeof structure})`);
    }
}

const structures = {
    Guild: require('../structure/guild/Guild').Guild,
    Message: require('../structure/Message').Message
};
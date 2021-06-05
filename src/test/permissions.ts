import { describe, it } from "mocha";
import assert from "assert";
import { Permissions } from "../structure/Permission";
import { Permission } from "../util/Constants";

describe("Permissions", function () {

    it("does proper has checks", function () {

        const perms = new Permissions(undefined, 12n);

        assert.strictEqual(perms.has(Permission.ADMINISTRATOR), true);
        assert.strictEqual(perms.has(Permission.BAN_MEMBERS), true);
        assert.strictEqual(perms.has(Permission.CREATE_INSTANT_INVITE), false);
        assert.strictEqual(perms.has(Permission.DEAFEN_MEMBERS), false);
    });

    it("does properly allow", function () {

        const perms = new Permissions(undefined, 12n);

        assert.strictEqual(perms.has(Permission.ADMINISTRATOR), true);
        assert.strictEqual(perms.has(Permission.BAN_MEMBERS), true);
        assert.strictEqual(perms.has(Permission.CREATE_INSTANT_INVITE), false);
        assert.strictEqual(perms.has(Permission.DEAFEN_MEMBERS), false);

        perms.allow(Permission.ADMINISTRATOR);

        assert.strictEqual(perms.has(Permission.ADMINISTRATOR), true);
        assert.strictEqual(perms.has(Permission.BAN_MEMBERS), true);
        assert.strictEqual(perms.has(Permission.CREATE_INSTANT_INVITE), false);
        assert.strictEqual(perms.has(Permission.DEAFEN_MEMBERS), false);

        perms.allow(Permission.CREATE_INSTANT_INVITE);

        assert.strictEqual(perms.has(Permission.ADMINISTRATOR), true);
        assert.strictEqual(perms.has(Permission.BAN_MEMBERS), true);
        assert.strictEqual(perms.has(Permission.CREATE_INSTANT_INVITE), true);
        assert.strictEqual(perms.has(Permission.DEAFEN_MEMBERS), false);
    });

    it("does properly deny", function () {

        const perms = new Permissions(undefined, 12n);

        assert.strictEqual(perms.has(Permission.ADMINISTRATOR), true);
        assert.strictEqual(perms.has(Permission.BAN_MEMBERS), true);
        assert.strictEqual(perms.has(Permission.CREATE_INSTANT_INVITE), false);
        assert.strictEqual(perms.has(Permission.DEAFEN_MEMBERS), false);

        perms.deny(Permission.ADMINISTRATOR);

        assert.strictEqual(perms.has(Permission.ADMINISTRATOR), false);
        assert.strictEqual(perms.has(Permission.BAN_MEMBERS), true);
        assert.strictEqual(perms.has(Permission.CREATE_INSTANT_INVITE), false);
        assert.strictEqual(perms.has(Permission.DEAFEN_MEMBERS), false);

        perms.deny(Permission.CREATE_INSTANT_INVITE);

        assert.strictEqual(perms.has(Permission.ADMINISTRATOR), false);
        assert.strictEqual(perms.has(Permission.BAN_MEMBERS), true);
        assert.strictEqual(perms.has(Permission.CREATE_INSTANT_INVITE), false);
        assert.strictEqual(perms.has(Permission.DEAFEN_MEMBERS), false);
    })

    it("contains proper permissions", function () {
        const perms = new Permissions(undefined, Permission.ALL);

        assert.strictEqual(perms.has(Permission.CREATE_INSTANT_INVITE), true);
        assert.strictEqual(perms.has(Permission.KICK_MEMBERS), true);
        assert.strictEqual(perms.has(Permission.BAN_MEMBERS), true);
        assert.strictEqual(perms.has(Permission.ADMINISTRATOR), true);
    });

});
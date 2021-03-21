
import { ConcordiaClient } from "@developerdragon/concordiaclient";
import { GuildManager } from "../managers/GuildManager";
import { UserManager } from "../managers/UserManager";
import { RequestHandler } from "../rest/RequestHandler";
import { CreateChannelInviteOptions, CreateChannelOptions, CreateChannelWebhookOptions, CreateGuildEmojiOptions, CreateGuildOptions, CreateRoleOptions, DiscordEditMessageContent, DiscordMessageContent, EditBotUserOptions, EditChannelOptions, EditGuildIntegration, EditGuildMemberOptions, EditGuildOptions, PruneMembersOptions, Snowflake, StatusOptions, VoiceChannelOptions, WebhookOptions } from "../util/Constants";
import { DCFile } from "../util/DCFile";
import { Endpoints } from "../util/Endpoints";
import { WebsocketManager } from "../websocket/WebsocketManager";
import { BaseClient, ClientOptions } from "./BaseClient";
import { ClientLogger } from "./ClientLogger";
import { ClientUser } from "./ClientUser";

export class Client extends BaseClient {

    ws: WebsocketManager;

    guilds: GuildManager;

    users: UserManager;

    requestHandler: RequestHandler;

    logger: ClientLogger;

    user: ClientUser;

    concordiaClient: ConcordiaClient;

    constructor(options: ClientOptions = {}) {
        super(Object.assign({ _tokenType: 'Bot' }, options));

        this.ws = new WebsocketManager(this);

        this.guilds = new GuildManager(this, undefined, { cache: options.guildCache });

        this.users = new UserManager(this, undefined, { cache: options.userCache });

        this.requestHandler = new RequestHandler(this);

        this.logger = new ClientLogger(this, this.options.debug);

        if (options.concordiaEnabled)
            this.concordiaClient = new ConcordiaClient({ host: options.concordiaHost, port: options.concordiaPort, token: options.concordiaToken });
    }

    async login(token?: string): Promise<void> {
        if (!this.options.token) this.options.token = token;
        await this.ws.connect();
        this.ws.sendIdentify(this.options.token);
    }

    /*
        Guild methods
    */

    addGuildMemberRole(guildID: Snowflake, memberID: Snowflake, roleID: Snowflake, reason: string): Promise<any> {
        return this.requestHandler.request("PUT", Endpoints.GUILD_MEMBER_ROLE(guildID, memberID, roleID), true, { reason });
    }

    banGuildMember(guildID: Snowflake, memberID: Snowflake, deleteMessageDays: number, reason: string): Promise<any> {
        if (isNaN(deleteMessageDays) || (deleteMessageDays < 0 || deleteMessageDays > 7))
            return Promise.reject(new Error(`Invalid deleteMessageDays value (${deleteMessageDays}), should be a number between 0-7 inclusive`));

        return this.requestHandler.request("PUT", Endpoints.GUILD_BAN(guildID, memberID), true, {
            delete_message_days: deleteMessageDays || 0,
            reason
        });
    }

    // type 0 (text), 2 (voice), or 4 (category)
    createChannel(guildID: Snowflake, name: string, type: number, options?: CreateChannelOptions): Promise<any> {
        return this.requestHandler.request("POST", Endpoints.GUILD_CHANNELS(guildID), true, {
            name,
            type,
            bitrate: options?.bitrate,
            nsfw: options?.nsfw,
            parent_id: options?.parentID,
            permission_overwrites: options?.permissionOverwrites,
            rate_limit_per_user: options?.messageCooldown,
            reason: options?.reason,
            topic: options?.topic,
            user_limit: options?.userLimit
        });
    }

    createChannelInvite(channelID: Snowflake, options?: CreateChannelInviteOptions): Promise<any> {
        return this.requestHandler.request("POST", Endpoints.CHANNEL_INVITES(channelID), true, {
            max_age: options?.maxAge,
            max_uses: options?.maxUses,
            temporary: options?.temporary,
            unique: options?.unique,
            reason: options?.reason
        });
    }

    createGuild(name: string, options?: CreateGuildOptions): Promise<any> {
        if (this.guilds.cache.size >= 10)
            Promise.reject("This method cannot be used when in 10 or more guilds");
        return this.requestHandler.request("POST", Endpoints.GUILDS(), true, {
            name: name,
            region: options?.region,
            icon: options?.icon,
            verification_level: options?.verificationLevel,
            default_message_notifications: options?.defaultNotifications,
            explicit_content_filter: options?.explicitContentFilter,
            system_channel_id: options?.systemChannelID,
            afk_channel_id: options?.afkChannelID,
            afk_timeout: options?.afkTimeout,
            roles: options?.roles,
            channels: options?.channels
        });
    }

    createGuildEmoji(name: string, options: CreateGuildEmojiOptions): Promise<any> {
        return
    }

    createRole(guildID: Snowflake, options: CreateRoleOptions): Promise<any> {
        return
    }

    deleteGuild(guildID: Snowflake): Promise<any> {
        return
    }

    deleteGuildEmoji(guildID: Snowflake, emojiID: Snowflake, reason?: string): Promise<any> {
        return
    }

    deleteGuildIntegration(guildID: Snowflake, integrationID: Snowflake): Promise<any> {
        return
    }

    deleteInvite(inviteID: Snowflake, reason?: string): Promise<any> {
        return
    }

    deleteRole(guildID: Snowflake, roleID: Snowflake): Promise<any> {
        return
    }

    editGuild(guildID: Snowflake, options: EditGuildOptions): Promise<any> {
        return this.requestHandler.request("PATCH", Endpoints.GUILD(guildID), true, {
            name: options.name,
            region: options.region,
            icon: options.icon,
            verification_level: options.verificationLevel,
            default_message_notifications: options.defaultNotifications,
            explicit_content_filter: options.explicitContentFilter,
            system_channel_id: options.systemChannelID,
            rules_channel_id: options.rulesChannelID,
            public_updates_channel_id: options.publicUpdatesChannelID,
            preferred_locale: options.preferredLocale,
            afk_channel_id: options.afkChannelID,
            afk_timeout: options.afkTimeout,
            owner_id: options.ownerID,
            splash: options.splash,
            banner: options.banner,
            description: options.description,
            reason: options.reason
        })
    }

    editGuildEmoji(guildID: Snowflake, emojiID: Snowflake, options: CreateGuildEmojiOptions) {
        return
    }

    editGuildIntegration(guildID: Snowflake, integrationID: Snowflake, options: EditGuildIntegration): Promise<any> {
        return
    }

    editGuildMember(guildID: Snowflake, memberID: Snowflake, options: EditGuildMemberOptions): Promise<any> {
        return
    }

    editRole(guildID: Snowflake, roleID: Snowflake, options: CreateRoleOptions): Promise<any> {
        return
    }

    editRolePosition(guildID: Snowflake, roleID: Snowflake, position: number): Promise<any> {
        return
    }

    getGuildAuditLogs(guildID: Snowflake, limit: number = 50, before?: Snowflake, type?: number): Promise<any> {
        return
    }

    getGuildBan(guildID: Snowflake, userID: Snowflake): Promise<any> {
        return
    }

    getGuildBans(guildID: Snowflake): Promise<any> {
        return
    }

    getGuildIntegrations(guildID: Snowflake): Promise<any> {
        return
    }

    getGuildInvites(guildID: Snowflake): Promise<any> {
        return
    }

    getGuildVanity(guildID: Snowflake): Promise<any> {
        return
    }

    pruneMembers(guildID: Snowflake, options: PruneMembersOptions): Promise<any> {
        return
    }

    getRESTGuild(guildID: Snowflake): Promise<any> {
        return
    }

    getRESTGuildChannels(guildID: Snowflake): Promise<any> {
        return
    }

    getRESTGuildEmoji(guildID: Snowflake, emojiID: Snowflake): Promise<any> {
        return
    }

    getRESTGuildMember(guildID: Snowflake, memberID: Snowflake): Promise<any> {
        return
    }

    getRESTGuildMembers(guildID: Snowflake, limit: number = 1, after?: Snowflake): Promise<any> {
        return
    }

    getRESTGuildRoles(guildID: Snowflake): Promise<any> {
        return
    }

    getRESTGuilds(limit: number = 100, before?: Snowflake, after?: Snowflake): Promise<any> {
        return
    }

    kickGuildMember(guildID: Snowflake, memberID: Snowflake, reason?: string): Promise<any> {
        return
    }

    leaveGuild(guildID: Snowflake): Promise<any> {
        return
    }

    removeGuildMemberRole(guildID: Snowflake, memberID: Snowflake, roleID: Snowflake, reason?: string): Promise<any> {
        return
    }

    syncGuildIntegration(guildID: Snowflake, integrationID: Snowflake): Promise<any> {
        return
    }

    unbanGuildMember(guildID: Snowflake, memberID: Snowflake, reason?: string): Promise<any> {
        return
    }



    closeVoiceConnection(guildID: Snowflake) {

    }

    /*
        Bot user methods
    */

    editAFK(): Promise<any> {
        return
    }

    editNickname(guildID: Snowflake, nick: string, reason?: string): Promise<any> {
        return
    }

    editSelf(options: EditBotUserOptions): Promise<any> {
        return
    }

    editStatus(options: StatusOptions): Promise<any> {
        return
    }

    /*
        User methods
    */

    getDMChannel(userID: Snowflake): Promise<any> {
        return
    }

    getRESTUser(userID: Snowflake): Promise<any> {
        return
    }

    /*
        Message methods
    */

    createMessage(channelID: Snowflake, content: string | DiscordMessageContent, file: DCFile | DCFile[]): Promise<any> {
        if (channelID === undefined) return;
        if (content != null) {
            // Make sure content we are sending is actually a string
            if (typeof content === "object")
                if (content.content !== undefined && typeof content.content !== "string")
                    content.content = "" + content.content;

            // Turn string into object
            if (typeof content !== "object" || content === null) {
                content = {
                    content: "" + content
                }
            }

            // We are trying to send an empty message
            if (content.content === undefined && !content.embed && !file) {
                return Promise.reject(new Error("No content, file, or embed"));
            }
        }
        else if (file == null)
            return Promise.reject(new Error("No content, file, or embed"));

        return this.requestHandler.request("POST", Endpoints.CHANNEL_MESSAGES(channelID), true, content, file);
    }

    deleteMessage(channelID: Snowflake, messageID: Snowflake, reason?: string): Promise<any> {
        return this.requestHandler.request("DELETE", Endpoints.CHANNEL_MESSAGE(channelID, messageID), true, { reason });
    }

    deleteMessages(channeLID: Snowflake, messageIDs: Snowflake[], reason: string): Promise<any> {
        return
    }

    publishMessage(channelID: Snowflake, messageID: Snowflake): Promise<any> {
        return
    }

    addMessageReaction(channelID: Snowflake, messageID: Snowflake, reaction: string): Promise<any> {
        return
    }

    editMessage(channelID: Snowflake, messageID: Snowflake, content: string | DiscordEditMessageContent): Promise<any> {
        if (content !== undefined) {
            if (typeof content !== "object" || content === null) {
                content = {
                    content: "" + content
                };
            } else if (content.content !== undefined && typeof content.content !== "string") {
                content.content = "" + content.content;
            } else if (content.content === undefined && !content.embed && content.flags === undefined) {
                return Promise.reject(new Error("No content, embed or flags"));
            }
            content.allowed_mentions = this._formatAllowedMentions(content.allowedMentions);
        }
        return this.requestHandler.request("PATCH", Endpoints.CHANNEL_MESSAGE(channelID, messageID), true, content);
    }

    getMessage(channelID: Snowflake, messageID: Snowflake): Promise<any> {
        return
    }

    getMessageReaction(channelID: Snowflake, messageID: Snowflake, reaction: string, limit: number = 100, before?: Snowflake, after?: Snowflake): Promise<any> {
        return
    }

    getMessages(channelID: Snowflake, limit: number = 50, before?: Snowflake, after?: Snowflake, around?: Snowflake): Promise<any[]> {
        return
    }

    pinMessage(channelID: Snowflake, messageID: Snowflake): Promise<any> {
        return
    }

    unpinMessage(channelID: Snowflake, messageID: Snowflake): Promise<any> {
        return
    }

    removeMessageReaction(channelID: Snowflake, messageID: Snowflake, reaction: string, userID: Snowflake): Promise<any> {
        return
    }

    removeMessageReactionEmoji(channelID: Snowflake, messageID: Snowflake, reaction: string): Promise<any> {
        return
    }

    removeMessageReactions(channelID: Snowflake, messageID: Snowflake): Promise<any> {
        return
    }

    /*
        Channel methods
    */

    deleteChannel(channelID: Snowflake, reason: string): Promise<any> {
        return
    }

    deleteChannelPermission(channelID: Snowflake, overwriteID: Snowflake, reason: string): Promise<any> {
        return
    }

    editChannel(channeLID: Snowflake, options: EditChannelOptions): Promise<any> {
        return
    }

    editChannelPermission(channelID: Snowflake, overwriteID: Snowflake, allow: number, deny: number, type: "member" | "role", reason?: string): Promise<any> {
        return
    }

    editChannelPosition(channeLID: Snowflake, position: number): Promise<any> {
        return
    }

    followChannel(channelID: Snowflake, targetChannelID: Snowflake): Promise<any> {
        return
    }

    getRESTChannel(channelID: Snowflake): Promise<any> {
        return
    }

    getChannelInvites(channelID: Snowflake): Promise<any> {
        return
    }

    getPins(channelID: Snowflake): Promise<any> {
        return
    }

    sendChannelTyping(channelID: Snowflake): Promise<any> {
        return
    }

    /*
        Webhook methods
    */

    createChannelWebhook(channelID: Snowflake, options?: CreateChannelWebhookOptions): Promise<any> {
        return
    }

    deleteWebhook(webhookID: Snowflake, token: string, reason?: string): Promise<any> {
        return
    }

    editChannelWebhook(webhookID: Snowflake, token: string, options: CreateChannelWebhookOptions): Promise<any> {
        return
    }

    executeWebhook(webhookID: Snowflake, token: string, options: WebhookOptions): Promise<any> {
        return
    }

    getChannelWebhooks(channelID: Snowflake): Promise<any> {
        return
    }

    getGuildWebhooks(guildID: Snowflake): Promise<any> {
        return
    }

    getWebhook(webhookID: Snowflake, token: string): Promise<any> {
        return
    }

    joinVoiceChannel(channelID: Snowflake, options?: VoiceChannelOptions): Promise<any> {
        return
    }

    leaveVoiceChannel(channelID: Snowflake): Promise<any> {
        return
    }

    /*
        Miscellaneous methods
    */

    getInvite(inviteID: Snowflake, withCounts?: boolean): Promise<any> {
        return
    }

    getBotGateway(): Promise<any> {
        if (!this.options.token.startsWith("Bot ")) {
            this.options.token = "Bot " + this.options.token;
        }
        return this.requestHandler.request("GET", Endpoints.GATEWAY_BOT(), true);
    }

    getSelf(): Promise<any> {
        return
    }

    _formatAllowedMentions(allowed) {

        if (!allowed) return {
            parse: ["everyone"],
            users: [],
            roles: []
        }; // Default value

        const result = {
            parse: [],
            roles: [],
            users: []
        };
        if (allowed.everyone) {
            result.parse.push("everyone");
        }
        if (allowed.roles === true) {
            result.parse.push("roles");
        } else if (Array.isArray(allowed.roles)) {
            if (allowed.roles.length > 100) {
                throw new Error("Allowed role mentions cannot exceed 100.");
            }
            result.roles = allowed.roles;
        }
        if (allowed.users === true) {
            result.parse.push("users");
        } else if (Array.isArray(allowed.users)) {
            if (allowed.users.length > 100) {
                throw new Error("Allowed user mentions cannot exceed 100.");
            }
            result.users = allowed.users;
        }
        return result;
    }


}
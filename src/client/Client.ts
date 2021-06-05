
import { ConcordiaClient } from "@developerdragon/concordiaclient";
import moment from "moment";
import { Logger } from "winston";
import { ChannelManager } from "../managers/ChannelManager";
import { GuildManager } from "../managers/GuildManager";
import { MessageManager } from "../managers/MessageManager";
import { PrivateChannelManager } from "../managers/PrivateChannelManager";
import { UserManager } from "../managers/UserManager";
import { RequestHandler } from "../rest/RequestHandler";
import { Guild } from "../structure/guild/Guild";
import { GuildChannel } from "../structure/guild/GuildChannel";
import { PrivateChannel } from "../structure/user/PrivateChannel";
import { ChannelType, CreateChannelInviteOptions, CreateChannelOptions, CreateChannelWebhookOptions, CreateGuildEmojiOptions, CreateGuildOptions, CreateRoleOptions, DiscordEditMessageContent, DiscordMessageContent, EditBotUserOptions, EditChannelOptions, EditGuildIntegration, EditGuildMemberOptions, EditGuildOptions, PruneMembersOptions, Snowflake, StatusOptions, VoiceChannelOptions, WebhookOptions } from "../util/Constants";
import { DCFile } from "../util/DCFile";
import { Endpoints } from "../util/Endpoints";
import { WebsocketManager } from "../websocket/WebsocketManager";
import { createLogger } from "../winston/patch";
import { transport } from "../winston/transport";
import { BaseClient, ClientOptions } from "./BaseClient";
import { ClientUser } from "./ClientUser";

export class Client extends BaseClient {

    ws: WebsocketManager;

    channels: ChannelManager;
    guilds: GuildManager;

    privateChannels: PrivateChannelManager;

    users: UserManager;

    requestHandler: RequestHandler;

    logger: Logger;

    user: ClientUser;

    messages: MessageManager;

    concordiaClient: ConcordiaClient;

    constructor(options: ClientOptions = {}) {
        super(Object.assign({ _tokenType: 'Bot' }, options));

        this.ws = new WebsocketManager(this);

        this.channels = new ChannelManager(this, { cache: true });
        this.guilds = new GuildManager(this, { cache: options.guildCache });

        this.users = new UserManager(this, { cache: options.userCache });

        this.messages = new MessageManager(this, {
            cacheOptions: {
                limit: this.options.messageCacheMaxSize,
                cacheDuration: moment.duration(this.options.messageCacheLifetime),
                autoClean: true,
                autoCleanInterval: moment.duration(this.options.messageSweepInterval)
            }
        })

        this.privateChannels = new PrivateChannelManager(this, { cache: true });

        this.requestHandler = new RequestHandler(this);

        this.logger = createLogger({ transports: transport(), level: this.options.logLevel });

        if (options.concordiaEnabled)
            this.concordiaClient = new ConcordiaClient({ host: options.concordiaHost, port: options.concordiaPort, token: options.concordiaToken });
    }

    async login(token?: string): Promise<void> {
        if (!this.options.token) this.options.token = token;
        await this.ws.connect();
        this.ws.sendIdentify(this.options.token, this.options.intents);
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
    createChannel(guildID: Snowflake, name: string, type: number | ChannelType | string, options?: CreateChannelOptions): Promise<any> {
        if (typeof type === "string") type = ChannelType[type as string];
        if (type === 13 && !(this.guilds.resolve(guildID)?.features?.includes("COMMUNITY") ?? true)) throw Error("Can not create stage channel in non-community guild");
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
        return this.requestHandler.request("PUT", Endpoints.GUILD_ROLES(guildID), true, options);
    }

    deleteGuild(guildID: Snowflake): Promise<any> {
        return this.requestHandler.request("DELETE", Endpoints.GUILD(guildID), true);
    }

    deleteGuildEmoji(guildID: Snowflake, emojiID: Snowflake, reason?: string): Promise<any> {
        return this.requestHandler.request("DELETE", Endpoints.GUILD_EMOJI(guildID, emojiID), true, { reason });
    }

    deleteGuildIntegration(guildID: Snowflake, integrationID: Snowflake): Promise<any> {
        return this.requestHandler.request("DELETE", Endpoints.GUILD_INTEGRATION(guildID, integrationID), true);
    }

    deleteInvite(inviteID: Snowflake, reason?: string): Promise<any> {
        return this.requestHandler.request("DELETE", Endpoints.INVITE(inviteID), true, { reason });
    }

    deleteRole(guildID: Snowflake, roleID: Snowflake): Promise<any> {
        return this.requestHandler.request("DELETE", Endpoints.GUILD_ROLE(guildID, roleID), true);
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
        return this.requestHandler.request("PATCH", Endpoints.GUILD_EMOJI(guildID, emojiID), true, options);
    }

    editGuildIntegration(guildID: Snowflake, integrationID: Snowflake, options: EditGuildIntegration): Promise<any> {
        return this.requestHandler.request("PATCH", Endpoints.GUILD_INTEGRATION(guildID, integrationID), true, {
            expire_behavior: options.expireBehavior,
            expire_grace_period: options.expireGracePeriod,
            enable_emoticons: options.enableEmoticons
        });
    }

    editGuildMember(guildID: Snowflake, memberID: Snowflake, options: EditGuildMemberOptions): Promise<any> {
        return this.requestHandler.request("PATCH", Endpoints.GUILD_MEMBER(guildID, memberID), true, options);
    }

    editRole(guildID: Snowflake, roleID: Snowflake, options: CreateRoleOptions): Promise<any> {
        return this.requestHandler.request("PATCH", Endpoints.GUILD_ROLE(guildID, roleID), true, options);
    }

    async editRolePosition(guildID: Snowflake, roleID: Snowflake, position: number): Promise<any> {
        if (guildID === roleID)
            throw new Error("Cannot move @everyone role");
        const guild: Guild = this.guilds.get(guildID);
        if (guild.partial)
            await guild.roles.fetch();

        const role = guild.roles.get(roleID);
        if (!role)
            throw Error(`Unknown role ${roleID}`)

        if (role.position === position)
            return;


        const min = Math.min(position, role.position);
        const max = Math.max(position, role.position);
        const roles = guild._roles.filter((role) => min <= role.position && role.position <= max && role.id !== roleID).sort((a, b) => a.position - b.position);
        if (position > role.position)
            roles.push(role);
        else
            roles.unshift(role);

        return this.requestHandler.request("PATCH", Endpoints.GUILD_ROLES(guildID), true, roles.map((role, index) => ({
            id: role.id,
            position: index + min
        })));
    }

    getGuildAuditLogs(guildID: Snowflake, limit: number = 50, before?: Snowflake, type?: number): Promise<any> {
        return this.requestHandler.request("GET", Endpoints.GUILD_AUDIT_LOGS(guildID), true, { limit, before, type });
    }

    getGuildBan(guildID: Snowflake, userID: Snowflake): Promise<any> {
        return this.requestHandler.request("GET", Endpoints.GUILD_BAN(guildID, userID), true);
    }

    getGuildBans(guildID: Snowflake): Promise<any> {
        return this.requestHandler.request("GET", Endpoints.GUILD_BANS(guildID), true);
    }

    getGuildIntegrations(guildID: Snowflake): Promise<any> {
        return this.requestHandler.request("GET", Endpoints.GUILD_INTEGRATIONS(guildID), true);
    }

    getGuildInvites(guildID: Snowflake): Promise<any> {
        return this.requestHandler.request("GET", Endpoints.GUILD_INVITES(guildID), true);
    }

    getGuildVanity(guildID: Snowflake): Promise<any> {
        return this.requestHandler.request("GET", Endpoints.GUILD_VANITY_URL(guildID), true);
    }

    pruneMembers(guildID: Snowflake, options: PruneMembersOptions): Promise<any> {
        return this.requestHandler.request("POST", Endpoints.GUILD_PRUNE(guildID), true, {
            compute_prune_count: options.computePruneCount,
            include_roles: options.includeRoles,
            days: options.days,
            reason: options.reason
        })
    }

    getRESTGuild(guildID: Snowflake): Promise<any> {
        return this.requestHandler.request("GET", Endpoints.GUILD(guildID), true);
    }

    getRESTGuildEmoji(guildID: Snowflake, emojiID: Snowflake): Promise<any> {
        return this.requestHandler.request("GET", Endpoints.GUILD_EMOJI(guildID, emojiID), true);
    }

    getRESTGuildChannels(guildID: Snowflake): Promise<any> {
        return this.requestHandler.request("GET", Endpoints.GUILD_CHANNELS(guildID), true);
    }

    getRESTGuildMember(guildID: Snowflake, memberID: Snowflake): Promise<any> {
        return this.requestHandler.request("GET", Endpoints.GUILD_MEMBER(guildID, memberID), true);
    }

    getRESTGuildMembers(guildID: Snowflake, limit: number = 55, after?: Snowflake): Promise<any> {
        return this.requestHandler.request("GET", Endpoints.GUILD_MEMBERS(guildID), true, { limit, after });
    }

    getRESTGuildRole(guildID: Snowflake, roleID: Snowflake): Promise<any> {
        return this.requestHandler.request("GET", Endpoints.GUILD_ROLE(guildID, roleID), true);
    }

    getRESTGuildRoles(guildID: Snowflake): Promise<any> {
        return this.requestHandler.request("GET", Endpoints.GUILD_ROLES(guildID), true);
    }

    getRESTGuilds(limit: number = 100, before?: Snowflake, after?: Snowflake): Promise<any> {
        return this.requestHandler.request("GET", Endpoints.GUILDS(), true, { limit, before, after });
    }

    kickGuildMember(guildID: Snowflake, memberID: Snowflake, reason?: string): Promise<any> {
        return this.requestHandler.request("DELETE", Endpoints.GUILD_MEMBER(guildID, memberID), true, { reason })
    }

    leaveGuild(guildID: Snowflake): Promise<any> {
        return this.requestHandler.request("DELETE", Endpoints.USER_GUILD("@me", guildID), true);
    }

    removeGuildMemberRole(guildID: Snowflake, memberID: Snowflake, roleID: Snowflake, reason?: string): Promise<any> {
        return this.requestHandler.request("DELETE", Endpoints.GUILD_MEMBER_ROLE(guildID, memberID, roleID), true, { reason });
    }

    syncGuildIntegration(guildID: Snowflake, integrationID: Snowflake): Promise<any> {
        return this.requestHandler.request("POST", Endpoints.GUILD_INTEGRATION_SYNC(guildID, integrationID), true);
    }

    unbanGuildMember(guildID: Snowflake, memberID: Snowflake, reason?: string): Promise<any> {
        return this.requestHandler.request("DELETE", Endpoints.GUILD_BAN(guildID, memberID), true, { reason });
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

    async getDMChannel(userID: Snowflake, cache = true): Promise<PrivateChannel> {
        return this.privateChannels.add(
            await this.requestHandler.request("POST", Endpoints.USER_CHANNELS("@me"), true, { recipient_id: userID }),
            cache,
            userID
        );
    }

    getRESTUser(userID: Snowflake): Promise<any> {
        return this.requestHandler.request("GET", Endpoints.USER(userID), true);
    }

    /*
        Message methods
    */

    createMessage(channelID: Snowflake, content: string | DiscordMessageContent, file?: DCFile | DCFile[]): Promise<any> {
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

    deleteMessages(channelID: Snowflake, messages: Snowflake[], reason: string): Promise<any> {
        return this.requestHandler.request("DELETE", Endpoints.CHANNEL_MESSAGES(channelID), true, { reason, messages });
    }

    publishMessage(channelID: Snowflake, messageID: Snowflake): Promise<any> {
        return this.requestHandler.request("POST", Endpoints.CHANNEL_CROSSPOST(channelID, messageID), true);
    }

    addMessageReaction(channelID: Snowflake, messageID: Snowflake, reaction: string): Promise<any> {
        return this.requestHandler.request("PUT", Endpoints.CHANNEL_MESSAGE_REACTION(channelID, messageID, reaction), true);
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
        return this.requestHandler.request("GET", Endpoints.CHANNEL_MESSAGE(channelID, messageID), true);
    }

    getMessageReaction(channelID: Snowflake, messageID: Snowflake, reaction: string, limit: number = 100, before?: Snowflake, after?: Snowflake): Promise<any> {
        return this.requestHandler.request("GET", Endpoints.CHANNEL_MESSAGE_REACTION(channelID, messageID, reaction), true, { limit, before, after });
    }

    getMessages(channelID: Snowflake, limit: number = 50, before?: Snowflake, after?: Snowflake, around?: Snowflake): Promise<any> {
        return this.requestHandler.request("GET", Endpoints.CHANNEL_MESSAGES(channelID), true, { limit, before, after, around });
    }

    pinMessage(channelID: Snowflake, messageID: Snowflake): Promise<any> {
        return this.requestHandler.request("PUT", Endpoints.CHANNEL_PIN(channelID, messageID), true);
    }

    unpinMessage(channelID: Snowflake, messageID: Snowflake): Promise<any> {
        return this.requestHandler.request("DELETE", Endpoints.CHANNEL_PIN(channelID, messageID), true);
    }

    removeMessageReaction(channelID: Snowflake, messageID: Snowflake, reaction: string, userID: Snowflake): Promise<any> {
        return this.requestHandler.request("DELETE", Endpoints.CHANNEL_MESSAGE_REACTION_USER(channelID, messageID, reaction, userID), true);
    }

    removeMessageReactionEmoji(channelID: Snowflake, messageID: Snowflake, reaction: string): Promise<any> {
        return this.requestHandler.request("DELETE", Endpoints.CHANNEL_MESSAGE_REACTION(channelID, messageID, reaction), true);
    }

    removeMessageReactions(channelID: Snowflake, messageID: Snowflake): Promise<any> {
        return this.requestHandler.request("DELETE", Endpoints.CHANNEL_MESSAGE_REACTIONS(channelID, messageID), true);
    }

    /*
        Channel methods
    */

    deleteChannel(channelID: Snowflake, reason?: string): Promise<any> {
        return this.requestHandler.request("DELETE", Endpoints.CHANNEL(channelID), true, { reason });
    }

    deleteChannelPermission(channelID: Snowflake, overwriteID: Snowflake, reason?: string): Promise<any> {
        return this.requestHandler.request("DELETE", Endpoints.CHANNEL_PERMISSION(channelID, overwriteID), true, { reason });
    }

    editChannel(channelID: Snowflake, options: EditChannelOptions): Promise<any> {
        return this.requestHandler.request("PATCH", Endpoints.CHANNEL(channelID), true, options);
    }

    editChannelPermission(channelID: Snowflake, overwriteID: Snowflake, allow: number, deny: number, type: "member" | "role", reason?: string): Promise<any> {
        return this.requestHandler.request("PATCH", Endpoints.CHANNEL_PERMISSION(channelID, overwriteID), true, { allow, deny, type, reason });
    }

    async editChannelPosition(channeLID: Snowflake, position: number, options: any): Promise<any> {
        const channel: GuildChannel = this.channels.get(channeLID);
        if (!channel)
            throw Error(`Unknown channel ${channeLID}`)

        const guild: Guild = channel.guild;
        if (guild.partial)
            await guild.fetch();

        if (channel.position === position)
            return;


        const min = Math.min(position, channel.position);
        const max = Math.max(position, channel.position);
        const channels = guild.channels.cache.values().filter((channel) => min <= channel.position && channel.position <= max && channel.id !== channeLID).sort((a, b) => a.position - b.position);
        if (position > channel.position)
            channels.push(channel);
        else
            channels.unshift(channel);

        return this.requestHandler.request("PATCH", Endpoints.GUILD_CHANNELS(guild.id), true, channels.map((role, index) => ({
            id: role.id,
            position: index + min,
            lock_permissions: options.lockPermissions,
            parent_id: options.parentID
        })));
    }

    followChannel(channelID: Snowflake, targetChannelID: Snowflake): Promise<any> {
        return this.requestHandler.request("POST", Endpoints.CHANNEL_FOLLOW(channelID), true, { webhook_channel_id: targetChannelID });
    }

    getRESTChannel(channelID: Snowflake): Promise<any> {
        return this.requestHandler.request("GET", Endpoints.CHANNEL(channelID), true);
    }

    getChannelInvites(channelID: Snowflake): Promise<any> {
        return this.requestHandler.request("GET", Endpoints.CHANNEL_INVITES(channelID), true);
    }

    getPins(channelID: Snowflake): Promise<any> {
        return this.requestHandler.request("GET", Endpoints.CHANNEL_PINS(channelID), true);
    }

    sendChannelTyping(channelID: Snowflake): Promise<any> {
        return this.requestHandler.request("POST", Endpoints.CHANNEL_TYPING(channelID), true);
    }

    /*
        Webhook methods
    */

    createWebhook(channelID: Snowflake, options?: CreateChannelWebhookOptions): Promise<any> {
        return this.requestHandler.request("POST", Endpoints.CHANNEL_WEBHOOKS(channelID), true, options);
    }

    deleteWebhook(webhookID: Snowflake, token: string, reason?: string): Promise<any> {
        return this.requestHandler.request("DELETE", Endpoints.WEBHOOK_TOKEN(webhookID, token), false, { reason });
    }

    editWebhook(webhookID: Snowflake, token: string, options: CreateChannelWebhookOptions): Promise<any> {
        return this.requestHandler.request("PATCH", Endpoints.WEBHOOK_TOKEN(webhookID, token), false, options);
    }

    executeWebhook(webhookID: Snowflake, token: string, options: WebhookOptions): Promise<any> {
        if (!options.content && !options.file && !options.embeds) {
            return Promise.reject(new Error("No content, file, or embeds"));
        }
        return this.requestHandler.request("POST", Endpoints.WEBHOOK_TOKEN(webhookID, token) + (options.wait ? "?wait=true" : ""), !!options.auth, {
            content: options.content,
            embeds: options.embeds,
            username: options.username,
            avatar_url: options.avatarURL,
            tts: options.tts,
            allowed_mentions: this._formatAllowedMentions(options.allowedMentions)
        }, options.file);
    }

    getChannelWebhooks(channelID: Snowflake): Promise<any> {
        return this.requestHandler.request("GET", Endpoints.CHANNEL_WEBHOOKS(channelID), true);
    }

    getGuildWebhooks(guildID: Snowflake): Promise<any> {
        return this.requestHandler.request("GET", Endpoints.GUILD_WEBHOOKS(guildID), true);
    }

    getWebhook(webhookID: Snowflake, token: string): Promise<any> {
        return this.requestHandler.request("GET", Endpoints.WEBHOOK_TOKEN(webhookID, token), true);
    }

    joinVoiceChannel(channelID: Snowflake, options?: VoiceChannelOptions): Promise<any> {
        return
    }

    leaveVoiceChannel(channelID: Snowflake): Promise<any> {
        return
    }

    /*
        Interactions
    */

    getGlobalCommands(applicationID: Snowflake) {
        return this.requestHandler.request("GET", Endpoints.APPLICATION_COMMANDS(applicationID), true);
    }

    overwriteGlobalCommands(applicationID: Snowflake, commands: any[]) {
        return this.requestHandler.request("PATCH", Endpoints.APPLICATION_COMMANDS(applicationID), true, commands);
    }

    createGlobalCommand(applicationID: Snowflake, options: any) {
        return this.requestHandler.request("GET", Endpoints.APPLICATION_COMMANDS(applicationID), true, {
            name: options.name,
            description: options.description,
            options: options.options,
            default_permission: options.defaultPermission
        });
    }

    getGlobalCommand(applicationID: Snowflake, commandID: Snowflake) {
        return this.requestHandler.request("GET", Endpoints.APPLICATION_COMMAND(applicationID, commandID), true);
    }

    editGlobalCommand(applicationID: Snowflake, commandID: Snowflake, options: any) {
        return this.requestHandler.request("GET", Endpoints.APPLICATION_COMMAND(applicationID, commandID), true, {
            name: options.name,
            description: options.description,
            options: options.options,
            default_permission: options.defaultPermission
        });
    }

    deleteGlobalCommand(applicationID: Snowflake, commandID: Snowflake) {
        return this.requestHandler.request("DELETE", Endpoints.APPLICATION_COMMAND(applicationID, commandID), true);
    }


    getGuildCommands(applicationID: Snowflake, guildID: Snowflake) {
        return this.requestHandler.request("GET", Endpoints.GUILD_COMMANDS(applicationID, guildID), true);
    }

    overwriteGuildCommands(applicationID: Snowflake, guildID: Snowflake, commands: any[]) {
        return this.requestHandler.request("PATCH", Endpoints.GUILD_COMMANDS(applicationID, guildID), true, commands);
    }

    createGuildCommand(applicationID: Snowflake, guildID: Snowflake, options: any) {
        return this.requestHandler.request("GET", Endpoints.GUILD_COMMANDS(applicationID, guildID), true, {
            name: options.name,
            description: options.description,
            options: options.options,
            default_permission: options.defaultPermission
        });
    }

    getGuildCommand(applicationID: Snowflake, guildID: Snowflake, commandID: Snowflake) {
        return this.requestHandler.request("GET", Endpoints.GUILD_COMMAND(applicationID, guildID, commandID), true);
    }

    editGuildCommand(applicationID: Snowflake, guildID: Snowflake, commandID: Snowflake, options: any) {
        return this.requestHandler.request("GET", Endpoints.GUILD_COMMAND(applicationID, guildID, commandID), true, {
            name: options.name,
            description: options.description,
            options: options.options,
            default_permission: options.defaultPermission
        });
    }

    deleteGuildCommand(applicationID: Snowflake, guildID: Snowflake, commandID: Snowflake) {
        return this.requestHandler.request("DELETE", Endpoints.GUILD_COMMAND(applicationID, guildID, commandID), true);
    }

    createResponse(interactionID: Snowflake, token: string, response: any) {
        return this.requestHandler.request("POST", Endpoints.INTERACTION_CALLBACK(interactionID, token), false, response);
    }

    getOriginalResponse(interactionID: Snowflake, token: string) {
        return this.requestHandler.request("GET", Endpoints.INTERACTION_ORIGINAL(interactionID, token), false);
    }

    editOriginalResponse(interactionID: Snowflake, token: string, response: any) {
        return this.requestHandler.request("PATCH", Endpoints.INTERACTION_ORIGINAL(interactionID, token), false, response);
    }

    deleteOriginalResponse(interactionID: Snowflake, token: string) {
        return this.requestHandler.request("DELETE", Endpoints.INTERACTION_ORIGINAL(interactionID, token), false);
    }

    createFollowup(interactionID: Snowflake, token: string, options: WebhookOptions) {
        if (!options.content && !options.file && !options.embeds) {
            return Promise.reject(new Error("No content, file, or embeds"));
        }
        return this.requestHandler.request("POST", Endpoints.INTERACTION(interactionID, token), false, {
            content: options.content,
            embeds: options.embeds,
            username: options.username,
            avatar_url: options.avatarURL,
            tts: options.tts,
            allowed_mentions: this._formatAllowedMentions(options.allowedMentions)
        }, options.file);
    }

    editFollowup(interactionID: Snowflake, token: string, messageID: Snowflake, options: WebhookOptions) {
        if (!options.content && !options.file && !options.embeds) {
            return Promise.reject(new Error("No content, file, or embeds"));
        }
        return this.requestHandler.request("PATCH", Endpoints.INTERACTION_MESSAGES(interactionID, token, messageID), false, {
            content: options.content,
            embeds: options.embeds,
            username: options.username,
            avatar_url: options.avatarURL,
            tts: options.tts,
            allowed_mentions: this._formatAllowedMentions(options.allowedMentions)
        }, options.file);
    }

    deleteFollowup(interactionID: Snowflake, token: string, messageID: Snowflake) {
        return this.requestHandler.request("DELETE", Endpoints.INTERACTION_MESSAGES(interactionID, token, messageID), false);
    }

    getCommandsPermissions(applicationID: Snowflake, guildID: Snowflake) {
        return this.requestHandler.request("GET", Endpoints.GUILD_COMMANDS_PERMISSIONS(applicationID, guildID), true);
    }

    getCommandPermissions(applicationID: Snowflake, guildID: Snowflake, commandID: Snowflake) {
        return this.requestHandler.request("GET", Endpoints.GUILD_COMMAND_PERMISSIONS(applicationID, guildID, commandID), true);
    }

    editCommandPermissions(applicationID: Snowflake, guildID: Snowflake, commandID: Snowflake, permissions: any[]) {
        return this.requestHandler.request("PUT", Endpoints.GUILD_COMMAND_PERMISSIONS(applicationID, guildID, commandID), true, { permissions })
    }

    editCommandsPermissions(applicationID: Snowflake, guildID: Snowflake, options: any[]) {
        return this.requestHandler.request("PUT", Endpoints.GUILD_COMMANDS_PERMISSIONS(applicationID, guildID), true, options)
    }

    /*
        Miscellaneous methods
    */

    getInvite(inviteID: Snowflake, withCounts?: boolean): Promise<any> {
        return this.requestHandler.request("GET", Endpoints.INVITE(inviteID), true, {
            with_counts: withCounts
        });
    }

    getBotGateway(): Promise<any> {
        if (!this.options.token.startsWith("Bot "))
            this.options.token = "Bot " + this.options.token;

        return this.requestHandler.request("GET", Endpoints.GATEWAY_BOT(), true);
    }

    getSelf(): Promise<any> {
        return this.requestHandler.request("GET", Endpoints.USER("@me"), true);
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
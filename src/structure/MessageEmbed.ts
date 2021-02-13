import { Util } from "../util/Util";

export class MessageEmbed {

    type: MessageEmbedType;
    provider: MessageEmbedProvider;

    title: string;
    description: string;
    author: MessageEmbedAuthor;
    footer: MessageEmbedFooter;

    thumbnail: MessageEmbedThumbnail;
    image: MessageEmbedImage;
    video: MessageEmbedVideo;
    color: number;
    timestamp: number;

    url: string;

    fields: EmbedField[];

    constructor(data = {}, skipValidation = false) {
        this.setup(data, skipValidation);
    }

    setup(data, skipValidation) {
        this.type = data.type || 'rich';
        this.title = 'title' in data ? data.title : null;
        this.description = 'description' in data ? data.description : null;
        this.url = 'url' in data ? data.url : null;
        this.color = 'color' in data ? Util.resolveColor(data.color) : null;
        this.timestamp = 'timestamp' in data ? new Date(data.timestamp).getTime() : null;

        this.fields = [];
        if (data.fields) {
            this.fields = skipValidation ? data.fields.map(Util.cloneObject) : MessageEmbed.normalizeFields(data.fields);
        }

        this.thumbnail = data.thumbnail
            ? {
                url: data.thumbnail.url,
                proxyURL: data.thumbnail.proxyURL || data.thumbnail.proxy_url,
                height: data.thumbnail.height,
                width: data.thumbnail.width,
            }
            : null;

        this.image = data.image
            ? {
                url: data.image.url,
                proxyURL: data.image.proxyURL || data.image.proxy_url,
                height: data.image.height,
                width: data.image.width,
            }
            : null;

        this.video = data.video
            ? {
                url: data.video.url,
                proxyURL: data.video.proxyURL || data.video.proxy_url,
                height: data.video.height,
                width: data.video.width,
            }
            : null;

        this.author = data.author
            ? {
                name: data.author.name,
                url: data.author.url,
                iconURL: data.author.iconURL || data.author.icon_url,
                proxyIconURL: data.author.proxyIconURL || data.author.proxy_icon_url,
            }
            : null;

        this.provider = data.provider
            ? {
                name: data.provider.name,
                url: data.provider.name,
            }
            : null;

        this.footer = data.footer
            ? {
                text: data.footer.text,
                iconURL: data.footer.iconURL || data.footer.icon_url,
                proxyIconURL: data.footer.proxyIconURL || data.footer.proxy_icon_url,
            }
            : null;

        //this.files = data.files || [];
    }

    /**
     * The date displayed on this embed
     * @type {?Date}
     * @readonly
     */
    get createdAt() {
        return this.timestamp ? new Date(this.timestamp) : null;
    }

    get hexColor() {
        return this.color ? `#${this.color.toString(16).padStart(6, '0')}` : null;
    }

    get length() {
        return (
            (this.title?.length ?? 0) +
            (this.description?.length ?? 0) +
            (this.fields.length >= 1
                ? this.fields.reduce((prev, curr) => prev + curr.name.length + curr.value.length, 0)
                : 0) +
            (this.footer?.text.length ?? 0) +
            (this.author?.name.length ?? 0)
        );
    }

    addField(name: string, value: string, inline: boolean) {
        return this.addFields({ name, value, inline });
    }

    addFields(...fields: EmbedFieldData[]) {
        this.fields.push(...MessageEmbed.normalizeFields(...fields));
        return this;
    }

    spliceFields(index: number, deleteCount: number, ...fields: EmbedFieldData[]) {
        this.fields.splice(index, deleteCount, ...MessageEmbed.normalizeFields(...fields));
        return this;
    }

    setAuthor(name, iconURL, url) {
        this.author = { name, iconURL, url };
        return this;
    }

    setColor(color) {
        this.color = Util.resolveColor(color);
        return this;
    }

    setDescription(description) {
        description = description;
        this.description = description;
        return this;
    }

    setFooter(text, iconURL) {
        text = text;
        this.footer = { text, iconURL };
        return this;
    }

    setImage(url) {
        this.image = { url };
        return this;
    }

    setThumbnail(url) {
        this.thumbnail = { url };
        return this;
    }

    setTimestamp(timestamp: Date | number = Date.now()) {
        if (timestamp instanceof Date) timestamp = timestamp.getTime();
        this.timestamp = timestamp;
        return this;
    }

    setTitle(title) {
        title = title;
        this.title = title;
        return this;
    }

    setURL(url) {
        this.url = url;
        return this;
    }

    toJSON() {
        return {
            title: this.title,
            type: 'rich',
            description: this.description,
            url: this.url,
            timestamp: this.timestamp ? new Date(this.timestamp) : null,
            color: this.color,
            fields: this.fields,
            thumbnail: this.thumbnail,
            image: this.image,
            author: this.author
                ? {
                    name: this.author.name,
                    url: this.author.url,
                    icon_url: this.author.iconURL,
                }
                : null,
            footer: this.footer
                ? {
                    text: this.footer.text,
                    icon_url: this.footer.iconURL,
                }
                : null,
        };
    }

    static normalizeField(name: string, value: string, inline: boolean = false): EmbedField {
        if (!name) throw new RangeError('EMBED_FIELD_NAME');
        if (!value) throw new RangeError('EMBED_FIELD_VALUE');
        return { name, value, inline };
    }

    static normalizeFields(...fields: EmbedFieldData[]): EmbedField[] {
        return fields
            .flat(2)
            .map(field =>
                this.normalizeField(
                    field && field.name,
                    field && field.value,
                    field && typeof field.inline === 'boolean' ? field.inline : false,
                ),
            );
    }
}

export interface EmbedFieldData {
    name: string;
    value: string;
    inline?: boolean;
}

export interface EmbedField {
    name: string;
    value: string;
    inline: boolean;
}

export interface MessageEmbedThumbnail {
    url?: string,
    proxyURL?: string,
    height?: number,
    width?: number,
}

export interface MessageEmbedImage {
    url?: string,
    proxyURL?: string,
    height?: number,
    width?: number,
}

export interface MessageEmbedVideo {
    url?: string,
    proxyURL?: string,
    height?: number,
    width?: number,
}

export interface MessageEmbedAuthor {
    name?: string,
    url?: string,
    iconURL?: string,
    proxyIconURL?: string,
}

export interface MessageEmbedProvider {
    name?: string;
    url?: string
}

export interface MessageEmbedFooter {
    text?: string,
    iconURL?: string,
    proxyIconURL?: string,
}

export type MessageEmbedType = "rich" | "image" | "video" | "gifv" | "article" | "link";
import { Property } from "@tsed/common";

export class AttachmentType {

    public static readonly ASSIGNS_LIST = new AttachmentType("ASSIGNS_LIST", "assigns_list");
    public static readonly DOCUMENT = new AttachmentType("DOCUMENT", "document");
    public static readonly EVENT = new AttachmentType("EVENT", "event");
    public static readonly IMAGE = new AttachmentType("IMAGE", "image");
    public static readonly OTHER = new AttachmentType("OTHER", "other");
    public static readonly PUBLICATION = new AttachmentType("PUBLICATION", "publication");
    public static readonly VIDEO = new AttachmentType("VIDEO", "video");

    @Property({ name: "key" })
    public readonly key: string;

    @Property({ name: "description" })
    public readonly description: string;

    constructor(key: string, description: string) {
        this.key = key;
        this.description = description;
    }

    public static get keys(): string[] {
        return Object.keys(this);
    }

    public static get list(): AttachmentType[] {
        return AttachmentType.keys.map((key: string) => AttachmentType[key as AttachmentTypeKey] as AttachmentType);
    }

}

export type AttachmentTypeKey = keyof typeof AttachmentType;

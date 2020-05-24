export class AttachmentType {

    public static readonly ASSIGNS_LIST = new AttachmentType("ASSIGNS_LIST", "assigns_list");
    public static readonly DOCUMENT = new AttachmentType("DOCUMENT", "document");
    public static readonly EVENT = new AttachmentType("EVENT", "event");
    public static readonly IMAGE = new AttachmentType("IMAGE", "image");
    public static readonly OTHER = new AttachmentType("OTHER", "other");
    public static readonly PUBLICATION = new AttachmentType("PUBLICATION", "publication");
    public static readonly VIDEO = new AttachmentType("VIDEO", "video");

    constructor(private readonly key: string, public readonly name: string) {}

    public get value(): string {
        return this.key;
    }

    public static get keys(): string[] {
        return Object.keys(this);
    }

    public static get list(): AttachmentType[] {
        return AttachmentType.keys.map((key: string) => AttachmentType[key as AttachmentTypeKey] as AttachmentType);
    }

}

export type AttachmentTypeKey = keyof typeof AttachmentType;

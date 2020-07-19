import { Property, IgnoreProperty } from "@tsed/common";

export class Scope {

    public static readonly UNKNOWN = new Scope("UNKNOWN", "unknown", 0);
    public static readonly ADMIN = new Scope("ADMIN", "administrador", 100);

    public static readonly COORDENATOR = new Scope("COORDENATOR", "coordenador", 75);
    public static readonly STUDENT = new Scope("STUDENT", "estudante", 25);
    public static readonly COLLABORATOR = new Scope("COLLABORATOR", "colaborador", 25);

    @Property({ name: "key" })
    public readonly key: string;

    @Property({ name: "description" })
    public readonly description: string;

    @IgnoreProperty()
    @Property({ name: "access" })
    public readonly access: number;

    constructor(key: string, description: string, access: number = 0) {
        this.key = key;
        this.description = description;
        this.access = access;
    }

    public get isAdmin(): boolean {
        return this === Scope.ADMIN;
    }

    public get isStudent(): boolean {
        return this === Scope.STUDENT;
    }

    public get isCollaborator(): boolean {
        return this === Scope.COLLABORATOR;
    }

    public static get keys(): string[] {
        return Object.keys(this);
    }

    public static get list(): Scope[] {
        return Scope.keys.map((key: string) => Scope[key as ScopeKey] as Scope);
    }

}

export type ScopeKey = keyof typeof Scope;

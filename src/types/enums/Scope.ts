export class Scope {

    public static readonly ADMINISTRATOR = new Scope("ADMINISTRATOR", "administrador", 0);
    public static readonly COORDENATOR = new Scope("COORDENATOR", "coordenador", 1);
    public static readonly PROFESSOR = new Scope("PROFESSOR", "professor", 2);
    public static readonly STUDENT = new Scope("STUDENT", "estudante", 3);
    public static readonly COLLABORATOR = new Scope("COLLABORATOR", "colaborador", 4);

    constructor(private readonly key: string,
        public readonly name: string,
        public readonly access: number = 0) {
    }

    public get value(): string {
        return this.key;
    }

    public static get keys(): string[] {
        return Object.keys(this);
    }

    public static get list(): Scope[] {
        return Scope.keys.map((key: string) => Scope[key as ScopeKey] as Scope);
    }

}

export type ScopeKey = keyof typeof Scope;

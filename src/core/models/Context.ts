import { Property } from "@tsed/common";

import { User } from "../../entities";
import { Scope, IContext } from "../types";

export class Context implements IContext {

    @Property({ name: "user" })
    public user: User;

    @Property({ name: "scope" })
    public scope: Scope = Scope.UNKNOWN;

    @Property({ name: "projectIds" })
    public projectIds?: number[] = [];

    public isAdmin(): boolean {
        return this.scope === Scope.ADMIN;
    }

    public isStudent(): boolean {
        return this.scope === Scope.STUDENT;
    }

    public isCollaborator(): boolean {
        return this.scope === Scope.COLLABORATOR;
    }

}

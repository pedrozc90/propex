import { RoleEnum } from "./enum";

// --------------------------------------------------
// GENERIC
// --------------------------------------------------
export interface IAuth {
    token?: string;
    user?: User;
}

export interface IOptions {
    page?: number;
    rpp?: number;
    q?: string;
}

// --------------------------------------------------
// ENTITY
// --------------------------------------------------
export interface Audit {
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

export interface Role {
    key?: RoleEnum;
    description?: string;
}

export interface UserCredentials {
    email?: string;
    password?: string;
}

export interface User extends Audit {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    code?: string;
    role?: Role;
    phone?: string;
    active?: boolean;
    // student
    course?: string;
    period?: string;
    scholarship?: boolean;
    // coolaborator
    academicFunction?: string;
    affiliation?: string;
}

export interface Project extends Audit {
    id?: number;
    title?: string;
    program?: string;
    startSeason?: string;
    includedCourses?: string;
    ppcAndCourseCalendar?: string;
    requiredCoursesCredits?: string;
    infrastructure?: string;
    publicParticipation?: string;
    accompanimentAndEvaluation?: string;
    // disclosureMedias?: DisclosureMedia[];
    // events?: Event[];
    // evaluations?: Evaluation[];
    // futureDevelopmentPlans?: FutureDevelopmentPlan[];
    // partners?: Partner[];
    // demands?: Demand[];
    // publications?: Publication[];
    // projectHumanResources?: ProjectHumanResource[];
    // projectPublics?: ProjectPublic[];
    // targets?: Target[];
    // projectThemeAreas?: ProjectThemeArea[];
    // activities?: Activity[];
    // extensionLines?: ExtensionLine[];
    knowledgeAreas?: KnowledgeArea[];
    // attachments?: Attachment[];
}

export interface ExtensionLine extends Audit {
    id?: number;
    number?: number;
    name?: string;
    operation?: string;
    projects?: Project[];
}

export interface KnowledgeArea extends Audit {
    id?: number;
    name?: string;
    projects?: Project[];
}

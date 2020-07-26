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

export interface IPagination {
    sortBy?: string;
    descending?: boolean;
    page?: number;
    rowsPerPage?: number;
    rowsNumber?: number;
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

export interface AgeRange {
    key?: string;
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

export interface ProjectHumanResource {
    projectId?: number;
    project?: Project;
    userId?: number;
    user?: User;
    coordinate?: boolean;
    exclusive?: boolean;
    workload?: number;
    dateAdmission?: string;
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

export interface ProjectPublic extends Audit {
    projectId?: number;
    project?: Project;
    publicId?: number;
    public?: Public;
    directly?: boolean;
    otherPublicTitle?: string;
    otherPublicCras?: string;
}

export interface Public extends Audit {
    id?: number;
    name?: string;
    customizable?: boolean;
    cras?: string;
    deletedAt?: Date;
    projectPublics?: ProjectPublic[];
}

export interface Target extends Audit {
    id?: number;
    menNumber?: number;
    womenNumber?: number;
    ageRange?: AgeRange;
    project?: Project;
}

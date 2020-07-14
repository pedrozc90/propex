import { RoleEnum } from "./enum";

export interface IAuth {
    token?: string;
    user?: User;
}

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

export interface User extends UserCredentials {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    role?: Role;
    active?: boolean;
    createAt?: Date;
    updatedAt?: Date;
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
    // knowledgeAreas?: KnowledgeArea[];
    // attachments?: Attachment[];
}

export enum RoleEnum {
    ADMIN = "ADMIN",
    STUDENT = "STUDENT",
    COLLABORATOR = "COLLABORATOR",
    UNKOWN = "UNKNOWN"
}

export type RoleEnumKey = keyof typeof RoleEnum;

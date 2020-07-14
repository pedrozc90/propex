export enum RoleEnum {
    ADMIN = "ADMIN",
    MEMBER = "MEMBER",
    UNKOWN = "UNKNOWN"
}

export type RoleEnumKey = keyof typeof RoleEnum;

export enum Role {
    ADMIN = "admin",
    MEMBER = "member",
    UNKOWN = "unknown"
}

export type RoleKey = keyof typeof Role;

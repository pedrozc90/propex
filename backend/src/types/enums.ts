export enum Role {
    MASTER = "master",
    ADMIN = "admin",
    MEMBER = "member"
}

export type RoleKey = keyof typeof Role;

export enum Role {
    MASTER = "master",
    ADMIN = "admin",
    MEMBER = "member"
}

export enum Permission {
    ALL = "all"
}

export type RoleKey = keyof typeof Role;
export type PermissionKey = keyof typeof Permission;

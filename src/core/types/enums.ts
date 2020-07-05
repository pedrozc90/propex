export enum Permission {
    INSERT = 2,
    UDPATE = 4,
    DELETE = 8,
    ALL = Permission.INSERT & Permission.UDPATE & Permission.DELETE,
}

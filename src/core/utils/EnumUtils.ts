/**
 * Returns enum key of a specified value.
 * @param e                                 -- enum type.
 * @param v                                 -- enum value to be found.
 */
export function findEnumKey(e: any, v: any): any | null {
    return getEnumKeys(e).filter((k) => e[k] === v)[0] || null;
}

/**
 * Return a list of keys of a enum.
 * @param e                                 -- enum value
 */
export function getEnumKeys(e: any): any[] {
    return Object.keys(e);
}

// export function enumList(e: any): any[] {
//     return Object.keys(e).map((key: string) => EnumValueTransformer.of(e).from(key));
// }

/**
 * Check if a string is empty (null, undefined or length equal to zero)
 * @param s                                                     -- string.
 */
export function isEmpty(s: string | undefined | null): boolean {
    return (s === undefined || s === null || s.length === 0);
}

/**
 * Check if a string is empty (null, undefined or length equal to zero)
 * @param s                                                     -- string.
 */
export function isNotEmpty(s: string | undefined | null): boolean {
    return !isEmpty(s);
}

/**
 * Return a capitalized string.
 * @param s                                 -- string content.
 */
export function captalize(s: string): string {
    return s.split(" ").map((w) => w.substring(0, 1).concat(w.substring(1).toLowerCase())).join(" ");
}

/**
 * Return a snake string. (separated by '-')
 * @param s                                 -- string content.
 */
export function snake(s: string): string {
    return s.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/gi, "");
}

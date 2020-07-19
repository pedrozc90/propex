/* eslint-disable no-useless-escape */
/* eslint-disable no-control-regex */
const illegalRe = new RegExp(/[\/\?<>\\:\*\|":]/g);
const controlRe = new RegExp(/[\x00-\x1f\x80-\x9f]/g);
const reservedRe = new RegExp(/^\.+$/);
const windowsReservedRe = new RegExp(/^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i);

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

/**
 * Sanitize string and replace character for '-'.
 * @param s                                 -- string text.
 */
export function normalize(s: string): string {
    return sanitize(s, "-");
}

/**
 * Sanitize string by removing bag characters.
 * @param s                                 -- string text.
 * @param replacement                       -- replacement string.
 */
export function sanitize(s: string, replacement: string = "-"): string {
    const sanitized = s.replace(illegalRe, replacement)
        .replace(controlRe, replacement)
        .replace(reservedRe, replacement)
        .replace(windowsReservedRe, replacement);
    return sanitized.split("").splice(0, 255).join("");
}

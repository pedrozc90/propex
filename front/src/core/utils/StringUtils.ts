/* eslint-disable no-useless-escape */
/* eslint-disable no-control-regex */
export class StringUtils {

    private static readonly illegalRe = new RegExp(/[\/\?<>\\:\*\|":]/g);
    private static readonly controlRe = new RegExp(/[\x00-\x1f\x80-\x9f]/g);
    private static readonly reservedRe = new RegExp(/^\.+$/);
    private static readonly windowsReservedRe = new RegExp(/^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i);

    /**
     * Check if a string is empty (null, undefined or length equal to zero)
     * @param s                                                     -- string.
     */
    public static isEmpty(s: string | undefined | null): boolean {
        return (s === undefined || s === null || s.length === 0);
    }

    /**
     * Check if a string is empty (null, undefined or length equal to zero)
     * @param s                                                     -- string.
     */
    public static isNotEmpty(s: string | undefined | null): boolean {
        return !this.isEmpty(s);
    }

    /**
     * Return a capitalized string.
     * @param s                                 -- string content.
     */
    public static captalize(s: string): string {
        return s.split(" ").map((w) => w.substring(0, 1).concat(w.substring(1).toLowerCase())).join(" ");
    }

    /**
     * Return a snake string. (separated by '-')
     * @param s                                 -- string content.
     */
    public static snake(s: string): string {
        return s.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/gi, "");
    }

    /**
     * Sanitize string and replace character for '-'.
     * @param s                                 -- string text.
     */
    public static normalize(s: string): string {
        return this.sanitize(s, "-");
    }

    /**
     * Sanitize string by removing bag characters.
     * @param s                                 -- string text.
     * @param replacement                       -- replacement string.
     */
    public static sanitize(s: string, replacement = "-"): string {
        const sanitized = s.replace(this.illegalRe, replacement)
            .replace(this.controlRe, replacement)
            .replace(this.reservedRe, replacement)
            .replace(this.windowsReservedRe, replacement);
        return sanitized.split("").splice(0, 255).join("");
    }

}

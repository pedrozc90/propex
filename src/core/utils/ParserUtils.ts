/**
 * Extract base url from any url.
 * @param text                              -- url string
 */
export function extractBaseUrl(text: string): string | undefined {
    const match = text.match(/^.+?[^/:](?=[?/]|$)/g);
    if (!match) return;
    return match[match.length - 1];
}

/**
 * Extract file extension from content-type.
 * @param text                              -- url string
 */
export function extractContentType(text: string): string | undefined {
    const match = text.toLowerCase().match(/[^/](\w*)/g);
    if (!match) return;
    return match[match.length - 1];
}

/**
 * Verify if a value exists.
 * @param t                                 -- data.
 */
export function isEmpty<T>(t: T | undefined | null): t is T {
    return !!t;
}

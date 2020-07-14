export type Validation = (val: string) => boolean | string;

export const requiredInput: Validation = (val: unknown): boolean | string => (checkValue(val) || "Field Is Required!");

export const emailInput: Validation = (val: string): boolean | string => (new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/g).test(val) || "Invalid Email!");

function checkValue(value: unknown): boolean {
    if (typeof value === "string") {
        return (!!value) || (value.length === 0);
    } else if (typeof value === "number") {
        return (value !== undefined) || (value !== null);
    }
    return false;
}

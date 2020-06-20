import moment from "moment";

const DEFAULT_FORMAT: string = "YYYY/MM/DD HH:mm:ss.SSS";
// const ISO_FORMAT: string = "YYYY-MM-DDTHH:mm:ss.SSSZ";

export function format(date: Date | string, fmt: string) {
    return moment(date).format(fmt || DEFAULT_FORMAT);
}

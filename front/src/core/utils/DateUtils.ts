import moment from "moment";

export class DateUtils {

    public static toISOString(value: Date | string): string {
        return moment(value).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    }

    public static toBRString(value: Date | string): string {
        return moment(value).format("DD/MM/YYYY");
    }

    public static toDateString(value: Date | string): string {
        return moment(value).format("MM/DD/YYYY");
    }

    public static toDateTimeString(value: Date | string): string {
        return moment(value).format("MM/DD/YYYY HH:mm:ss");
    }

    public static toDate(value: Date | string, fmt: string) {
        return moment(value, fmt, true).toDate();
    }

    public static isValid(value: Date | string, fmt: string): boolean {
        return moment(value, fmt, true).isValid();
    }

    public static convertDate(value: Date | string | null, fmt1: string, fmt2: string): string | null {
        return (value && moment(value, fmt1).isValid()) ? moment(value, fmt1, true).format(fmt2) : null;
    }

    public static formatDate(value: Date | string, fmt: string): string {
        return moment(value).format(fmt);
    }

    public static compareDate(x: string | Date, y: string | Date): number {
        return moment(x).toDate().getTime() - moment(y).toDate().getTime();
    }

}

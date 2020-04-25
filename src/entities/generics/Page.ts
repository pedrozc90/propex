export class Page<T> {

    constructor(
        public page: number = 1,
        public rpp: number = 15,
        public more: boolean = false,
        public list: T[] = []
    ) {}

    public static of<T>(list: T[], page: number = 1, rpp: number = 0): Page<T> {
        const p: Page<T> = new Page<T>();
        p.page = page;
        p.rpp = rpp;
        p.more = (rpp > 0) && (list.length >= rpp);
        p.list = list;
        return p;
    }

}

export class Page<T> {

    public page?: number;
    public rpp?: number;
    public length?: number;
    public more?: boolean;
    public list: T[] = [];

    public static of<T>(list: T[] = [], page = 1, rpp = 15): Page<T> {
        const p: Page<T> = new Page<T>();
        p.list = list;
        p.length = list.length;
        p.more = (p.length <= rpp);
        p.page = page;
        p.rpp = rpp;
        return p;
    }

}

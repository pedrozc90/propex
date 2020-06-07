import { Property, Default } from "@tsed/common";

export class Page<T> {

    @Property({ name: "page" })
    public page?: number;

    @Default(15)
    @Property({ name: "rpp" })
    public rpp?: number;
    
    @Property({ name: "length" })
    public length?: number;

    @Default(false)
    @Property({ name: "more" })
    public more?: boolean;

    @Property({ name: "list" })
    public list: T[] = [];

    public static of<T>(list: T[] = [], page: number = 1, rpp: number = 15): Page<T> {
        const p: Page<T> = new Page<T>();
        p.list = list;
        p.length = list.length;
        p.more = (p.length <= rpp);
        p.page = page;
        p.rpp = rpp;
        return p;
    }

}

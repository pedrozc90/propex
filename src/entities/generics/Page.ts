import { Property, Default } from "@tsed/common";

export class Page<T> {

    // constructor(page: number = 1, rpp: number = 15, more: boolean = false, list: T[] = []) {
    //     this.page = page;
    //     this.rpp = rpp;
    //     this.more = more;
    //     this.list = list;
    // }

    @Property({ name: "page" })
    public page: number = 1;

    @Default(15)
    @Property({ name: "rpp" })
    public rpp: number = 15;
    
    @Default(false)
    @Property({ name: "more" })
    public more: boolean = false;

    @Property({ name: "list" })
    public list: T[] = [];

    public static of<T>(list: T[], page: number = 1, rpp: number = 0): Page<T> {
        const p: Page<T> = new Page<T>();
        p.page = page;
        p.rpp = rpp;
        p.more = (rpp > 0) && (list.length >= rpp);
        p.list = list;
        return p;
    }

}

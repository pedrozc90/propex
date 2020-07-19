/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component, Watch } from "vue-property-decorator";

import { User } from "../../core/types";
import { userService } from "../../core/services";
import { Page } from "../../core/models";
import { StringUtils } from "src/core/utils";

@Component({ name: "UsersPage" })
export default class UsersPage extends Vue {

    public users: User[] = [];
    public page: number | undefined = 1;
    public rpp: number | undefined = 15;
    public q: string | undefined = "";

    public columns: any[] = [
        { name: "name", label: "name", field: "name", sortable: false },
        { name: "email", label: "email", field: "email", sortable: false },
        { name: "role", label: "role", field: "role", sortable: false },
        { name: "code", label: "code", field: "code", sortable: false },
        { name: "phone", label: "phone", field: "phone", sortable: false }
    ];

    public pagination = {
        sortBy: "desc",
        descending: false,
        page: this.page,
        rowsPerPage: this.rpp
    };

    @Watch("q")
    public async onSearchChange(newValue: string, oldValue?: string) {
        if (newValue === oldValue) return;
        await this.load();
    }

    public async onUpdatePagination(newPagination: any) {
        console.log(newPagination);
        this.page = newPagination.page;
        this.rpp = newPagination.rowsPerPage;
        await this.load();
    }

    public async open(event: any, user: User): Promise<void> {
        if (user && user.id) {
            await this.$router.replace({ name: "user:registration", params: { id: `${user.id}` } });
        }
    }

    public async load(): Promise<void> {
        this.users = await userService.fetch({ page: this.page, rpp: this.rpp, q: this.q })
            .then((res: Page<User> | null) => (res) ? res.list : []);
    }

    public async mounted(): Promise<void> {
        await this.load();
    }

}

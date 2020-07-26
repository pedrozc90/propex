/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component, Watch } from "vue-property-decorator";

import { User } from "../../core/types";
import { userService } from "../../core/services";
import { Page } from "../../core/models";

@Component({ name: "UsersPage" })
export default class UsersPage extends Vue {

    public users: User[] = [];

    public q?: string = "";
    public loading = false;

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
        page: 1,
        rowsPerPage: 15,
        rowsNumber: 0
    };

    @Watch("q")
    public async onSearchChange(newValue: string, oldValue?: string) {
        if (newValue === oldValue) return;
        await this.onRequest({ pagination: this.pagination, filter: undefined });
    }

    public async onRequest(props: any): Promise<void> {
        const { page, rowsPerPage } = props.pagination;

        this.loading = true;

        const result: Page<User> = await userService.fetch({
            page: page,
            rpp: rowsPerPage,
            q: this.q
        });

        if (result) {
            this.users.splice(0, this.users.length, ...result.list);
            this.pagination.page = page;
            this.pagination.rowsPerPage = rowsPerPage;
            this.pagination.rowsNumber = result.total || 0;
        }

        this.loading = false;
    }

    public async open(event: any, user: User): Promise<void> {
        if (user && user.id) {
            await this.$router.replace({ name: "user:edit", params: { id: `${user.id}` } });
        }
    }

    public async mounted(): Promise<void> {
        await this.onRequest({ pagination: this.pagination, filter: undefined });
    }

}

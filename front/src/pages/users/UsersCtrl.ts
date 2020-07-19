/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component } from "vue-property-decorator";

import { requiredInput } from "../../core/utils";

import { User } from "../../core/types";
import { userService } from "../../core/services";
import { Page } from "../../core/models";

@Component({ name: "UsersPage" })
export default class UsersPage extends Vue {

    public users: User[] = [];

    public page: number | undefined = 1;
    public rpp: number | undefined = 15;
    public q: string | undefined = undefined;

    public async load(): Promise<void> {
        this.users = await userService.fetch({ page: this.page, rpp: this.rpp, q: this.q }).then((res: Page<User> | null) => (res) ? res.list : []);
    }

    public mounted() {
        // avoid inputs to display error message on page load
        (this.$refs.form1 as any).resetValidation();
        (this.$refs.form2 as any).resetValidation();
        (this.$refs.form3 as any).resetValidation();
    }

}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component } from "vue-property-decorator";

import { projectService, userService } from "../../../core/services";
import { Page } from "../../../core/models";
import { Project, User } from "../../../core/types";
import { StringUtils, requiredInput } from "../../../core/utils";

@Component({ name: "ProjectRegistration" })
export default class ProjectRegistration extends Vue {
    
    public project: Project = {};
    public coordinator: User | null = null;
    public coordinatorOptions: User[] = [];

    public requiredInput = requiredInput;

    public filterFn(value: any, update: any, abort: any): void {
        // do nothing
        setTimeout(() => {
            update(async () => {
                // debugger;
                if (StringUtils.isNotEmpty(value)) {
                    await this.loadOptions(value);
                } else {
                    // await this.loadOptions();
                    abort();
                }
            });
        }, 1000);
    }

    public async filterAbortFn(): Promise<void> {
        // do nothing
    }

    public async reset(): Promise<void> {
        // do nothing
    }

    public async submit(): Promise<void> {
        // do nothing
        const valid = await (this.$refs.form as any).validate();
        if (!valid) return;

        if (!this.coordinator) return;
        
        const project = await projectService.create(this.project, this.coordinator);
        if (project) {
            await this.$router.replace({ name: "index" });
        }
    }

    public async goToUserRegistration(): Promise<void> {
        await this.$router.push({ name: "user-registration" });
    }

    public async loadOptions(q?: string) {
        this.coordinatorOptions = await userService.fetchCollaborators({ q }).then((res: Page<User>) => res.list);
    }

    public async mounted() {
        await this.loadOptions();
        (this.$refs.form as any).resetValidation();
    }

}

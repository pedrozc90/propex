import { Vue, Component } from "vue-property-decorator";

import { projectService, userService } from "../../../core/services";

import { StringUtils } from "../../../core/utils/";

import { Page } from "../../../core/models";
import { Project, User } from "../../../core/types";
import { requiredInput } from "../../../core/utils";

@Component({ name: "ProjectRegistration" })
export default class ProjectRegistration extends Vue {
    
    public id: number | undefined;
    public project: Project = {};
    public coordinator: User | null = null;
    public coordinatorOptions: User[] = [
        { id: 1, name: "USER-01", email: "user-01@propex.com" },
        { id: 2, name: "USER-02", email: "user-02@propex.com" },
        { id: 3, name: "USER-03", email: "user-03@propex.com" }
    ];

    public requiredInput = requiredInput;

    public filterFn(value: any, update: any, abort: any): void {
        // do nothing
        setTimeout(() => {
            update(async () => {
                if (StringUtils.isNotEmpty(value)) {
                    await this.loadOptions(value);
                }
            });
        }, 1500);
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
        console.log(project);
        // if (project) {
        //     await this.$router.replace({ name: "index" });
        // }
    }

    public async mounted() {
        await this.loadOptions();
        (this.$refs.form as any).resetValidation();
        console.log("COORDINATOR:", this.coordinatorOptions);
    }

    public async loadOptions(q?: string) {
        this.coordinatorOptions = await userService.fetchCollaborators().then((res: Page<User>) => res.list);
        console.log("COORDINATOR:", this.coordinatorOptions);
    }

}

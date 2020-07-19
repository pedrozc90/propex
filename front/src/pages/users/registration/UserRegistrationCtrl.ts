/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component, Watch, Prop } from "vue-property-decorator";

import { requiredInput, StringUtils } from "../../../core/utils";
import { userService } from "../../../core/services";
import { User, RoleEnum } from "../../../core/types";

@Component({ name: "UserRegistration" })
export default class UserRegistration extends Vue {

    private readonly student: RoleEnum = RoleEnum.STUDENT;
    private readonly collaborator: RoleEnum = RoleEnum.COLLABORATOR;

    public id: number | undefined;

    public user: User = {};

    public role = this.student
    public isPassword = true;

    public requiredInput = requiredInput;

    @Watch("role")
    public onRoleChange(newValue?: RoleEnum, oldValue?: RoleEnum): void {
        if (!oldValue) return;
        if (newValue) {
            this.user.role = { key: newValue };
        }
        if (newValue === RoleEnum.STUDENT) {
            this.user.academicFunction = undefined;
            this.user.affiliation = undefined;
        } else if (newValue === RoleEnum.COLLABORATOR) {
            this.user.course = undefined;
            this.user.period = undefined;
            this.user.scholarship = false;
        }
    }

    public get ready(): boolean {
        return (this.userReady && (this.studentReady || this.collaboratorReady));
    }

    public get userReady(): boolean {
        if (!this.user) return false;
        return (!!this.user.email &&
                !!this.user.name &&
                !!this.user.phone);
    }

    public get studentReady(): boolean {
        if (this.user.role?.key !== RoleEnum.STUDENT) return false;
        return (!!this.user.code &&
                !!this.user.course &&
                !!this.user.period &&
                (typeof this.user.scholarship !== "undefined"));
    }

    public get collaboratorReady(): boolean {
        if (this.user.role?.key !== RoleEnum.COLLABORATOR) return false;
        return (!!this.user.code &&
                !!this.user.academicFunction &&
                !!this.user.affiliation);
    }

    public async submit(): Promise<void> {
        const validUser = await (this.$refs.form1 as any).validate();
        if (!validUser) return;
        
        if (this.user.role?.key === RoleEnum.STUDENT) {
            const validStudent = await (this.$refs.form2 as any).validate();
            if (!validStudent) return;
        }

        if (this.user.role?.key === RoleEnum.COLLABORATOR) {
            const validCollaborator = await (this.$refs.form3 as any).validate();
            if (!validCollaborator) return;
        }

        const user = await userService.save(this.user);
        if (user) {
            await this.$router.replace({ name: "index" });
        }
    }

    public reset(): void {
        console.log("USER:", this.user);
        if (!this.user.id) {
            this.user = {
                scholarship: false,
                role: { key: RoleEnum.STUDENT }
            };
        // } else {
        //     // this.user = null;
        }
    }

    public async mounted(): Promise<void> {
        if (StringUtils.isNotEmpty(this.$route.params.id)) {
            this.id = parseInt(this.$route.params.id);
            this.user = await userService.get(this.id);
        }
        // this.reset();
        // avoid inputs to display error message on page load
        (this.$refs.form1 as any).resetValidation();
        (this.$refs.form2 as any).resetValidation();
        (this.$refs.form3 as any).resetValidation();
    }

}

import { Vue, Component } from "vue-property-decorator";
import { User } from "../../core/types";
import { requiredInput } from "../../core/utils";
import { userService } from "src/core/services";

@Component({ name: "UserRegistration" })
export default class UserRegistration extends Vue {

    public user: User = {
        student: { scholarship: false },
        collaborator: {}
    };

    public isPassword = true;

    public requiredInput = requiredInput;

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
        if (!this.user.student) return false;
        return (!!this.user.student.code &&
                !!this.user.student.course &&
                !!this.user.student.period &&
                (typeof this.user.student.scholarship !== "undefined"));
    }

    public get collaboratorReady(): boolean {
        if (!this.user.collaborator) return false;
        return (!!this.user.collaborator.profissionalRegistry &&
                !!this.user.collaborator.academicFunction &&
                !!this.user.collaborator.affiliation);
    }

    public async submit(): Promise<void> {
        const validUser = await (this.$refs.form1 as any).validate();
        if (!validUser) return;
                
        const validSatudent = await (this.$refs.form2 as any).validate();
        
        const validCollaborator = await (this.$refs.form3 as any).validate();

        if (!validSatudent && !validCollaborator) return;

        if (validSatudent) {
            (this.$refs.form3 as any).resetValidation();
        }

        if (validCollaborator) {
            (this.$refs.form2 as any).resetValidation();
        }

        console.log("USER:", this.user);
        console.log("STUDENT:", this.user.student);
        console.log("COLLABORATOR:", this.user.collaborator);
        // const user = await userService.save(this.user);
        // if (user) {
        //     await this.$router.replace("index");
        // }
    }

    public reset(): void {
        if (!this.user.id) {
            this.user = {
                student: { scholarship: false },
                collaborator: {}
            };
        } else {
            // this.user = null;
        }
    }

    public mounted() {
        // avoid inputs to display error message on page load
        (this.$refs.form1 as any).resetValidation();
        (this.$refs.form2 as any).resetValidation();
        (this.$refs.form3 as any).resetValidation();
    }

}

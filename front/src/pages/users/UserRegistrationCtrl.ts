import { Vue, Component } from "vue-property-decorator";
import { User, Student, Collaborator } from "../../core/types";
import { requiredInput } from "../../core/utils";

@Component({ name: "UserRegistration" })
export default class UserRegistration extends Vue {

    public user: User = {
        student: {},
        collaborator: {}
    };

    public isPassword = true;

    public requiredInput = requiredInput;

    public async register(): Promise<void> {
        await (this.$refs.form as any).validate().then(
            (valid: boolean) => {
                if (valid) {
                    console.log("USER:", this.user);
                    console.log("STUDENT:", this.user.student);
                    console.log("COLLABORATOR:", this.user.collaborator);
                }
            }
        );
    }

    public mounted() {
        // avoid inputs to display error message on page load
        (this.$refs.form as any).resetValidation();
    }

}

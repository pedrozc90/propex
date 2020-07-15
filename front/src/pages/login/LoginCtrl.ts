/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component } from "vue-property-decorator";
import { UserCredentials } from "../../core/types";
import { requiredInput } from "../../core/utils";

@Component({ name: "Login" })
export default class Login extends Vue {

    public credentials: UserCredentials = {};
    public rememberMe = false;
    public isPassword = true;

    public requiredInput = requiredInput;

    public async login() {
        await (this.$refs.form as any).validate().then(
            async (valid: boolean) => {
                if (valid) {
                    await this.$store.dispatch("authentication/login", {
                        credentials: this.credentials,
                        rememberMe: this.rememberMe || false
                    });
                }
            }
        );
    }

    public mounted() {
        // avoid inputs to display error message on page load
        (this.$refs.form as any).resetValidation();
    }

}

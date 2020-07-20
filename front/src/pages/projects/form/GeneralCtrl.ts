import { Vue, Component, Prop } from "vue-property-decorator";

import { Project } from "../../../core/types";
import { projectService } from "../../../core/services";
import { requiredInput } from "../../../core/utils";

@Component({ name: "General" })
export default class GeneralCtrl extends Vue {

    @Prop({ type: Object, required: true, default: undefined }) public project!: Project;

    public requiredInput = requiredInput

    public async submit(): Promise<void> {
        // nothing
        await projectService.save(this.project);
    }

    public async reset(): Promise<void> {
        // nothing
    }

    public mounted(): void {
        console.log("GENERAL:", this.project);
    }

}

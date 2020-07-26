import { Vue, Component, Prop } from "vue-property-decorator";

import { Project } from "../../../core/types";
import { projectService } from "../../../core/services";
import { requiredInput } from "../../../core/utils";

@Component({ name: "General" })
export default class GeneralCtrl extends Vue {

    @Prop({ type: Number, required: true, default: undefined }) public id!: number;

    public project: Project = {};

    public requiredInput = requiredInput

    public async submit(): Promise<void> {
        const valid = await (this.$refs["form-general"] as any).validate();
        if (!valid) return;

        await projectService.save(this.project);
    }

    public async reset(): Promise<void> {
        this.project = await projectService.get(this.id);
    }

    public async mounted(): Promise<void> {
        this.project = await projectService.get(this.id);
        console.log("ID:", this.id, this.project);
    }

}

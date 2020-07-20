import { Vue, Component } from "vue-property-decorator";

import { projectService } from "../../core/services";

import { Project } from "../../core/types";
import { requiredInput } from "../../core/utils";

import General from "./form/General.vue";

@Component({
    name: "ProjectPage",
    components: { "general-form": General }
})
export default class ProjectPage extends Vue {
    
    public step = 1;

    public id?: number;
    public project: Project = {};

    public requiredInput = requiredInput;

    public async load(): Promise<void> {
        if (this.id) {
            this.project = await projectService.get(this.id);
        }
    }

    public async reset(): Promise<void> {
        // do nothing
    }

    public async submit(): Promise<void> {
        // do nothing
    }

    public async mounted() {
        this.id = parseInt(this.$route.params.id);
        console.log("PROJECT ID:", this.id);
        await this.load();
    }

}

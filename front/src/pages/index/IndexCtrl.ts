import { Vue, Component } from "vue-property-decorator";

import { projectService } from "../../core/services";
import { Project } from "../../core/types";

@Component({ name: "Index" })
export default class IndexCtrl extends Vue {

    public page = 1;
    public rpp = 15;
    public q: string | undefined;

    public projects: Project[] = [];

    public async edit(projectId: string): Promise<void> {
        await this.$router.push({ name: "project", params: { id: projectId } });
    }

    public async mounted() {
        console.log("i18n", this.$t("project"));
        const projects = await projectService.fetch({ page: this.page, rpp: this.rpp, q: this.q });
        if (projects) {
            this.projects.push(...projects.list);
        }
        console.log(this.projects);
    }

}

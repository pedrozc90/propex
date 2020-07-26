import { Vue, Component, Watch } from "vue-property-decorator";

import { projectService } from "../../core/services";
import { Project, KnowledgeArea, ExtensionLine } from "../../core/types";
import { Page } from "../../core/models";

import { knowledgeAreaService } from "../../core/services/KnowledgeAreaService";
import { extensionLineService } from "../../core/services/ExtensionLineService";

@Component({ name: "Index" })
export default class IndexCtrl extends Vue {

    public page = 1;
    public rpp = 15;
    public q: string | undefined = "";
    public knowledgeArea: KnowledgeArea = {};
    public extensionLine: ExtensionLine = {};

    public projects: Project[] = [];
    public knowledgeAreas: KnowledgeArea[] = [];
    public extensionLines: ExtensionLine[] = [];

    @Watch("extensionLine")
    @Watch("knowledgeArea")
    @Watch("q")
    public async relaod(): Promise<void> {
        this.page = 1;
        await this.load();
    }

    public async load(): Promise<void> {
        const projects = await projectService.fetch({
            page: this.page,
            rpp: this.rpp,
            q: this.q,
            extensionLineId: this.extensionLine.id,
            knowledgeAreaId: this.knowledgeArea.id
        });
        if (projects) {
            if (this.page === 1) {
                this.projects = projects.list;
            } else {
                this.projects.push(...projects.list);
            }
        }
    }

    public async edit(projectId: string): Promise<void> {
        await this.$router.push({ name: "project:edit", params: { id: projectId } });
    }

    public async mounted() {
        await this.load();

        this.knowledgeAreas = await knowledgeAreaService.fetch({ page: 0 }).then((res: Page<KnowledgeArea>) => res.list);
        this.extensionLines = await extensionLineService.fetch({ page: 0 }).then((res: Page<ExtensionLine>) => res.list);
    }

}

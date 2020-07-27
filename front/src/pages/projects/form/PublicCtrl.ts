/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component, Prop } from "vue-property-decorator";

import { IPagination, Target, ProjectPublic } from "../../../core/types";
import { projectService, publicService, targetService } from "../../../core/services";

import ProjectPublicCheckbox from "../../../components/ProjectPublicCheckbox.vue";

@Component({
    name: "Public",
    components: { "project-public-checkbox": ProjectPublicCheckbox }
})
export default class PublicCtrl extends Vue {

    @Prop({ type: Number, required: true, default: undefined }) public id!: number;

    public targets: Target[] = [];
    public projectPublics: ProjectPublic[] = [];

    public q?: string = "";
    public loading?: boolean = false;

    public columns: any[] = [
        { name: "ageRange", label: "ageRange", field: (row: any) => row.ageRange.description, sortable: false },
        { name: "menNumber", label: "menNumber", field: "menNumber", sortable: false },
        { name: "womenNumber", label: "womenNumber", field: "womenNumber", sortable: false }
    ];

    public pagination: IPagination = {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 15,
        rowsNumber: 0
    };

    public async submit(): Promise<void> {
        const x = 0;
        if (x !== 0) {
            await this.saveTargets();
        }

        const projectPublics = this.projectPublics.filter((pp) => typeof pp.directly !== "undefined");

        await projectService.savePublics(this.id, projectPublics);
    }

    public async reset(): Promise<void> {
        await this.initPublics();
        await this.initTargets();
    }

    public async initTargets(): Promise<void> {
        const result = await projectService.fetchTargets(this.id);

        this.targets = result.targets;

        const enumList = await targetService.listEnum();

        if (this.targets.length < enumList.length) {
            const targets = enumList.map((ag) => {
                const index = this.targets.findIndex((x) => x.ageRange?.key === ag.key);
                if (index >= 0) {
                    return this.targets[index];
                }

                const t: Target = {};
                t.ageRange = ag;
                t.menNumber = 0;
                t.womenNumber = 0;
                t.project = { id: this.id };
                return t;
            });

            this.targets.splice(0, this.targets.length, ...targets);
        }

        this.targets.sort(targetService.sort());
    }

    public async saveTargets(): Promise<void> {
        const response = await projectService.saveTargets(this.id, this.targets);
        if (response) {
            this.targets.splice(0, this.targets.length, ...response).sort(targetService.sort());
        }
    }

    public async initPublics(): Promise<void> {
        const projectPublics = await projectService.fetchPublics(this.id);
        if (!projectPublics) return;

        const publics = await publicService.fetch({ page: 0 });
        if (!publics) return;

        const array = publics.list.map((p) => {
            const index = projectPublics.findIndex((x) => x.publicId === p.id);
            
            if (index >= 0) {
                return projectPublics[index];
            }
            const pb: ProjectPublic = {
                public: p,
                publicId: p.id,
                project: { id: this.id },
                projectId: this.id
            };
            return pb;
        });

        this.projectPublics.splice(0, this.projectPublics.length, ...array);
    }

    public async mounted(): Promise<void> {
        await this.initTargets();
        await this.initPublics();
    }

}

import { Vue, Component, Prop, Watch } from "vue-property-decorator";

import { IPagination, Target } from "../../../core/types";
import { Page } from "src/core/models";
import { targetService } from "src/core/services/TargetService";

@Component({ name: "Public" })
export default class PublicCtrl extends Vue {

    @Prop({ type: Number, required: true, default: undefined }) public id!: number;

    public targets: Target[] = [];

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
        // nothing
        await Promise.all(this.targets.map(async (t) => {
            t.project = { id: this.id };
            await targetService.save(t);
        }));
    }

    public async reset(): Promise<void> {
        // nothing
    }

    public async mounted(): Promise<void> {
        // await this.onRequest({ pagination: this.pagination, filter: undefined });
        this.targets = await targetService.fetch({ project: this.id, page: 0, rpp: 0, q: this.q }).then((res: Page<Target>) => res.list);
        const enumList = await targetService.listEnum();
        console.log(this.targets, enumList);

        if (this.targets.length < enumList.length) {
            this.targets = enumList.map((ag) => {
                const t: Target = {};
                t.ageRange = ag;
                t.menNumber = 0;
                t.womenNumber = 0;
                t.project = { id: this.id };
                return t;
            });
        }
    }

}

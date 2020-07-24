import { Vue, Component, Prop } from "vue-property-decorator";

import { ProjectHumanResource, RoleEnum } from "../../../core/types";
import { projectService } from "../../../core/services";
import { requiredInput } from "../../../core/utils";

@Component({ name: "HumanResources" })
export default class HumanResourcesCtrl extends Vue {

    @Prop({ type: Number, required: true, default: undefined }) public id!: number;

    public requiredInput = requiredInput

    public collaborators: ProjectHumanResource[] = [];
    public students: ProjectHumanResource[] = [];

    public page = 1;
    public rpp = 15;
    public q: string | null = null;

    public columns: any[] = [
        { name: "name", label: "name", field: (row: any) => row.workload, sortable: false },
        { name: "email", label: "email", field: (row: any) => row.coordinate, sortable: false },
        { name: "role", label: "role", field: (row: any) => row.exclusive, sortable: false },
        { name: "code", label: "code", field: (row: any) => row.user.code, sortable: false },
        { name: "phone", label: "phone", field: (row: any) => row.user.phone, sortable: false }
    ];

    public pagination = {
        sortBy: "desc",
        descending: false,
        page: this.page,
        rowsPerPage: this.rpp
    };

    public onUpdatePagination(newPagination: any) {
        console.log(newPagination);
        this.page = newPagination.page;
        this.rpp = newPagination.rowsPerPage;
        // await this.load();
    }

    public async submit(): Promise<void> {
        // nothing
    }

    public async reset(): Promise<void> {
        // nothing
    }

    public async mounted(): Promise<void> {
        this.collaborators = await projectService.fetchHumanResources(this.id, { page: 1, rpp: 15, role: RoleEnum.COLLABORATOR }).then((page) => page.list);
        this.students = await projectService.fetchHumanResources(this.id, { page: 1, rpp: 15, role: RoleEnum.STUDENT }).then((page) => page.list);
        console.log(this.collaborators);
        console.log(this.students);
    }

}

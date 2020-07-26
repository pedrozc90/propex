import { Vue, Component, Prop, Watch } from "vue-property-decorator";

import { ProjectHumanResource, IPagination } from "../../../core/types";
import { projectService } from "../../../core/services";
import { requiredInput } from "../../../core/utils";
import { Page } from "src/core/models";

@Component({ name: "HumanResources" })
export default class HumanResourcesCtrl extends Vue {

    @Prop({ type: Number, required: true, default: undefined }) public id!: number;

    public requiredInput = requiredInput

    public collaborators: ProjectHumanResource[] = [];
    public students: ProjectHumanResource[] = [];

    public collaboratorSearch?: string = "";
    public studentSearch?: string = "";

    public collaboratorColumns: any[] = [
        { name: "name", label: "name", field: (row: any) => row.user.name, sortable: false },
        { name: "academicFunction", label: "academicFunction", field: (row: any) => row.user.academicFunction, sortable: false },
        { name: "code", label: "code", field: (row: any) => row.user.code, sortable: false },
        { name: "affiliation", label: "affiliation", field: (row: any) => row.user.affiliation, sortable: false },
        { name: "exclusive", label: "exclusive", field: (row: any) => row.exclusive, sortable: false },
        { name: "workload", label: "workload", field: (row: any) => row.workload, sortable: false },
        { name: "dateAdmission", label: "dateAdmission", field: (row: any) => row.user.dateAdmission, sortable: false }
    ];

    public collaboratorPagination: IPagination = {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 15,
        rowsNumber: 0
    };

    public loadingCollaborators = false;

    public studentColumns: any[] = [
        { name: "name", label: "name", field: "name", sortable: false },
        { name: "code", label: "code", field: "code", sortable: false },
        { name: "course", label: "course", field: "course", sortable: false },
        { name: "period", label: "period", field: "period", sortable: false },
        { name: "workload", label: "workload", field: "workload", sortable: false },
        { name: "contact", label: "contact", field: "contact", sortable: false }
    ];

    public studentPagination: IPagination = {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 15,
        rowsNumber: 0
    };

    public loadingStudents = false;

    public async submit(): Promise<void> {
        // nothing
    }

    public async reset(): Promise<void> {
        // nothing
    }

    @Watch("collaboratorSearch")
    public async searchCollaborator(newValue: string, oldValue?: string) {
        if (newValue === oldValue) return;
        await this.onRequestCollaborators({ pagination: this.collaboratorPagination, filter: undefined });
    }

    @Watch("studentSearch")
    public async searchStudent(newValue: string, oldValue?: string) {
        if (newValue === oldValue) return;
        await this.onRequestStudents({ pagination: this.studentPagination, filter: undefined });
    }

    public async onRequestCollaborators(props: any): Promise<void> {
        const { page, rowsPerPage /* sortBy, descending */ } = props.pagination;
        
        this.loadingCollaborators = true;

        const result: Page<ProjectHumanResource> = await projectService.fetchHumanResourcesCollaborators(this.id, {
            page: page,
            rpp: rowsPerPage,
            q: this.collaboratorSearch
        });

        if (result) {
            this.collaborators.splice(0, this.collaborators.length, ...result.list);
            this.collaboratorPagination.page = result.page || 1;
            this.collaboratorPagination.rowsPerPage = result.rpp || 15;
            this.collaboratorPagination.rowsNumber = result.total || 0;
        }

        this.loadingCollaborators = false;
    }

    public async onRequestStudents(props: any): Promise<void> {
        const { page, rowsPerPage /* sortBy, descending */ } = props.pagination;
        
        this.loadingStudents = true;

        const result: Page<ProjectHumanResource> = await projectService.fetchHumanResourcesStudents(this.id, {
            page: page,
            rpp: rowsPerPage,
            q: this.studentSearch
        });

        if (result) {
            this.students.splice(0, this.students.length, ...result.list);
            this.studentPagination.page = result.page || 1;
            this.studentPagination.rowsPerPage = result.rpp || 15;
            this.studentPagination.rowsNumber = result.total || 0;
        }

        this.loadingStudents = false;
    }

    public async mounted(): Promise<void> {
        await this.onRequestCollaborators({ pagination: this.collaboratorPagination, filter: undefined });
        await this.onRequestStudents({ pagination: this.studentPagination, filter: undefined });
    }

}

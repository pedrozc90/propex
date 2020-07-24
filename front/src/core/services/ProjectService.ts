import { axiosInstance } from "../../boot/axios";
import { AxiosResponse } from "axios";

import BasicService from "./BasicService";
import { Project, IOptions, User, ExtensionLine, KnowledgeArea, ProjectHumanResource, RoleEnumKey, RoleEnum } from "../types";
import { Page } from "../models";

export interface ProjectOptions extends IOptions {
    program?: string;
    extensionLine?: ExtensionLine;
    extensionLineId?: number;
    knowledgeArea?: KnowledgeArea;
    knowledgeAreaId?: number;
}

export interface ProjectHumanResourcesOptions extends IOptions {
    projectId?: number;
    coordinate?: boolean;
    exclusive?: boolean;
    role?: RoleEnum;
}

export class ProjectService extends BasicService<Project> {

    private static instance: ProjectService;

    constructor() {
        super("/projects");
    }

    public static create(): ProjectService {
        if (!ProjectService.instance) {
            ProjectService.instance = new ProjectService();
        }
        return ProjectService.instance;
    }

    public async fetch(options: ProjectOptions): Promise<Page<Project>> {
        const params: any = {};
        params.page = options.page;
        params.rpp = options.rpp;
        params.q = options.q;
        params["extension-line"] = options.extensionLine?.id || options.extensionLineId;
        params["knowledge-area"] = options.knowledgeArea?.id || options.knowledgeAreaId;
        return await axiosInstance.get<Project>(this.url, { params: params })
            .then((response: AxiosResponse) => response.data.content);
    }

    public async create(project: Project, coordinator: User): Promise<unknown> {
        return axiosInstance.post(this.url, { project, coordinator });
    }

    public async save(project: Project): Promise<unknown> {
        return axiosInstance.put(this.url, { project });
    }

    // --------------------------------------------------
    // HUMAN RESOURCES
    // --------------------------------------------------
    public async fetchHumanResources(projectId: number, params: ProjectHumanResourcesOptions): Promise<Page<ProjectHumanResource>> {
        return axiosInstance.get(`${this.url}/${projectId}/human-resources`, { params })
            .then((response: AxiosResponse) => response.data.content);
    }

}

export const projectService = ProjectService.create();

import { axiosInstance } from "../../boot/axios";
import { AxiosResponse } from "axios";

import BasicService from "./BasicService";
import { Project, IOptions, User, ExtensionLine, KnowledgeArea,
    ProjectHumanResource, RoleEnum, Target, ProjectPublic } from "../types";
import { Page } from "../models";
import { StringUtils } from "../utils";

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

export interface ProjectPublicOptions extends IOptions {
    projectId?: number;
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
        if (StringUtils.isEmpty(params.q)) {
            params.q = undefined;
        }
        return axiosInstance.get(`${this.url}/${projectId}/human-resources`, { params })
            .then((response: AxiosResponse) => response.data.content);
    }

    public async fetchHumanResourcesCollaborators(projectId: number, params: ProjectHumanResourcesOptions): Promise<Page<ProjectHumanResource>> {
        if (StringUtils.isEmpty(params.q)) {
            params.q = undefined;
        }
        return axiosInstance.get(`${this.url}/${projectId}/human-resources/collaborators`, { params })
            .then((response: AxiosResponse) => response.data.content);
    }

    public async fetchHumanResourcesStudents(projectId: number, params: ProjectHumanResourcesOptions): Promise<Page<ProjectHumanResource>> {
        if (StringUtils.isEmpty(params.q)) {
            params.q = undefined;
        }
        return axiosInstance.get(`${this.url}/${projectId}/human-resources/students`, { params })
            .then((response: AxiosResponse) => response.data.content);
    }

    // --------------------------------------------------
    // TARGETS
    // --------------------------------------------------
    public async fetchTargets(projectId: number): Promise<{ targets: Target[], total: number, totalNumberOfMen: number, totalNumberOfWomen: number }> {
        return axiosInstance.get(`${this.url}/${projectId}/targets`)
            .then((response: AxiosResponse) => response.data.content);
    }

    public async saveTargets(projectId: number, targets: Target[]): Promise<Target[]> {
        return axiosInstance.post(`${this.url}/${projectId}/targets`, { targets })
            .then((response: AxiosResponse) => response.data.content);
    }

    // --------------------------------------------------
    // PUBLICS
    // --------------------------------------------------
    public async fetchPublics(projectId: number): Promise<ProjectPublic[]> {
        return axiosInstance.get(`${this.url}/${projectId}/publics`)
            .then((response: AxiosResponse) => response.data.content);
    }

    public async savePublics(projectId: number, projectPublics: ProjectPublic[]): Promise<unknown> {
        return axiosInstance.post(`${this.url}/${projectId}/publics`, { projectPublics })
            .then((response: AxiosResponse) => response.data.content);
    }

}

export const projectService = ProjectService.create();

import { axiosInstance } from "../../boot/axios";
import { AxiosResponse } from "axios";

import BasicService from "./BasicService";
import { Project, IOptions, User } from "../types";
import { Page } from "../models";

export interface ProjectOptions extends IOptions {
    program?: string;
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

    public async fetch(params: ProjectOptions): Promise<Page<Project>> {
        return await axiosInstance.get<Project>(this.url, { params: params })
            .then((response: AxiosResponse) => response.data.content);
    }

    public async create(project: Project, coordinator: User): Promise<unknown> {
        return axiosInstance.post(this.url, { project, coordinator });
    }

}

export const projectService = ProjectService.create();

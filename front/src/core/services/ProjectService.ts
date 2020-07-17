import { axiosInstance } from "../../boot/axios";

import BasicService from "./BasicService";
import { Project } from "../types";

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

    public async save(user: Project): Promise<unknown> {
        return axiosInstance.post(this.url, { user });
    }

}

export const projectService = ProjectService.create();

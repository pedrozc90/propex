import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { ProjectThemeArea, Project, ThemeArea } from "../entities";
import { IOptions } from "../core/types";

interface ProjectThemeAreaOptions extends IOptions {
    id?: number;
    project?: Project;
    projectId?: number;
    themeArea?: ThemeArea;
    themeAreaId?: number;
    name?: string;
    main?: boolean;
}

@EntityRepository(ProjectThemeArea)
export class ProjectThemeAreaRepository extends GenericRepository<ProjectThemeArea> {

    /**
     * Search project theme areas of a specific project.
     * @param projectId                     -- porject id.
     */
    public async findManyByProject(projectId: number): Promise<ProjectThemeArea[]> {
        return this.createQueryBuilder("pta")
            .innerJoinAndSelect("pta.project", "p", "p.id = :projectId", { projectId })
            .getMany();
    }

    /**
     * Search project theme areas of a specific project.
     * @param projectId                     -- porject id.
     */
    public async findByProject(themeAreaId: number, projectId: number): Promise<ProjectThemeArea | undefined> {
        return this.createQueryBuilder("pta")
            .innerJoinAndSelect("pta.project", "p", "p.id = :projectId", { projectId })
            .innerJoinAndSelect("pta.themeArea", "ta", "ta.id = :themeAreaId", { themeAreaId })
            .getOne();
    }

    /**
     * Overwrite project theme areas relationship.
     * @param project                       -- project data.
     * @param theme_areas                   -- theme areas.
     */
    public async overwrite(project: Project, main?: ThemeArea[], secondary?: ThemeArea[]): Promise<ProjectThemeArea[]> {
        const projectThemeAreas: ProjectThemeArea[] = [];

        if (main) {
            projectThemeAreas.push(...main.map((ta) => {
                const pta = new ProjectThemeArea();
                pta.main = true;
                pta.project = project;
                pta.projectId = project.id;
                pta.themeArea = ta;
                pta.themeAreaId = ta.id;
                return pta;
            }));
        }

        if (secondary) {
            projectThemeAreas.push(...secondary.map((ta) => {
                const pta = new ProjectThemeArea();
                pta.main = false;
                pta.project = project;
                pta.projectId = project.id;
                pta.themeArea = ta;
                pta.themeAreaId = ta.id;
                return pta;
            }));
        }

        // array of theme areas id received
        const projectThemeAreaIds: number[] = projectThemeAreas.map((pta) => pta.themeArea.id);

        // load saved project theme areas
        const projectThemeAreasSaved: ProjectThemeArea[] = await this.findManyByProject(project.id);
        
        // filter project theme areas to be deleted
        const projectThemeAreasToDelete: ProjectThemeArea[] = projectThemeAreasSaved.filter((ptas) => !projectThemeAreaIds.includes(ptas.themeAreaId));
        if (projectThemeAreasToDelete.length > 0) {
            await this.remove(projectThemeAreasToDelete);
        }

        // filter project theme areas to be inserted/updated
        const projectThemeAreasToInsert: ProjectThemeArea[] = projectThemeAreas.filter((pta) => projectThemeAreasToDelete.findIndex((ptad) => ptad.themeAreaId === pta.themeArea.id) < 0);
        if (projectThemeAreasToInsert.length > 0) {
            await this.save(projectThemeAreasToInsert);
        }

        return this.findManyByProject(project.id);
    }
    
}

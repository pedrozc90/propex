import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { ProjectThemeArea, Project, ThemeArea } from "../entities";

@EntityRepository(ProjectThemeArea)
export class ProjectThemeAreaRepository extends GenericRepository<ProjectThemeArea> {

    /**
     * Search project theme areas of a specific project.
     * @param projectId                     -- porject id.
     */
    public async findByProject(projectId: number): Promise<ProjectThemeArea[]> {
        return this.createQueryBuilder("pta")
            .innerJoinAndSelect("pta.project", "project", "pta.project_id = :projectId", { projectId })
            .getMany();
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
        const projectThemeAreasSaved: ProjectThemeArea[] = await this.findByProject(project.id);
        
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

        return this.findByProject(project.id);
    }
    
}

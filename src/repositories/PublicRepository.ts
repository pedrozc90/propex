import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Public, Project } from "../entities";
import { ProjectRepository } from "./ProjectRepository";

const relations = [
    "projectPublics"
];

@EntityRepository(Public)
export class PublicRepository extends GenericRepository<Public> {

    constructor(private projectRepository: ProjectRepository) {
        super(relations);
    }

    /**
     * Return a array of publics which a project is linked to.
     * @param projectId                     -- project id.
     */
    public async findByProject(projectId: number): Promise<Public[]> {
        return this.createQueryBuilder("public")
            .innerJoinAndSelect("public.projectPublics", "pp", "pp.project_id = :projectId", { projectId })
            .getMany();
    }

    /**
     * Overrwrite a project publics.
     * @param project                       -- project data.
     * @param publics                       -- public array.
     */
    public async overwrite(project: Project, publics: Public[]): Promise<Public[]> {
        // find entities saved on database.
        const savedPublics = await this.findByProject(project.id);
        
        // entities not present in array shoould be deleted.
        const publicToDelete = savedPublics.filter((p) => publics.findIndex((r) => r.id === p.id) < 0);
        if (publicToDelete.length > 0) {
            await this.projectRepository.createQueryBuilder("project").relation("projectPublics").of(project).remove(publicToDelete);
        }

        // entities present in the array but not on database, neet to be saved.
        const publicToInsert = publics.filter((p) => !!p.id && savedPublics.findIndex((r) => r.id === p.id) < 0);
        if (publicToInsert.length > 0) {
            await this.projectRepository.createQueryBuilder("project").relation("projectPublics").of(project).add(publicToInsert);
        }

        // return a updated array.
        return this.findByProject(project.id);
    }

}

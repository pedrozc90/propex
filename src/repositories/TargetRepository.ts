import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Target, Project } from "../entities";
import { AgeRange, IOptions } from "../core/types";

interface TargetOptions extends IOptions {
    id?: number;
    ageRange?: AgeRange
    project?: Project;
    projectId?: number;
}

@EntityRepository(Target)
export class TargetRepository extends GenericRepository<Target> {

    /**
     * Return a list of all targets possibles.
     * @param project                       -- project data
     */
    public default(project: Project): Target[] {
        return AgeRange.list.map((ageRange) => {
            const t = new Target();
            t.project = project;
            t.ageRange = ageRange;
            return t;
        });
    }

    /**
     * Return a list of targets.
     * @param params                        -- target filters.
     */
    public async fetch(params: TargetOptions): Promise<Target[]> {
        const page = params.page;
        const rpp = params.rpp;

        const query = this.createQueryBuilder("t");
        
        if (params.project || params.projectId) {
            const projectId = params.projectId || params.project?.id;
            query.innerJoin("t.project", "p", "p.id = :projectId", { projectId });
        }

        if (params.ageRange) {
            query.where("t.age_range = :ageRage", { ageRage: params.ageRange.key });
        }

        if (page && page > 0 && rpp && rpp > 0) {
            query.skip((page - 1) * rpp).take(rpp);
        }

        return query.getMany();
    }

    // /**
    //  * Overwrite the targets of a project.
    //  * @param project                       -- selected project.
    //  * @param targets                       -- list of targets.
    //  */
    // public async overwrite(project: Project, targets: Target[]): Promise<Target[]> {
    //     // select project targets from database.
    //     const savedTargets = await this.find({
    //         join: {
    //             alias: "pt",
    //             innerJoinAndSelect: { project: "pt.project" }
    //         },
    //         where: { project: { id: project.id } }
    //     });

    //     if (savedTargets.length === 0) {
    //         throw new Exception(404, "Targets not found!");
    //     }

    //     // merge targets changes.
    //     savedTargets.map((t) => {
    //         const tmp = targets.find((pt) => pt.ageRange === t.ageRange);
    //         if (tmp) {
    //             t = this.merge(t, tmp);
    //         }

    //         if (!t.project) {
    //             t.project = project;
    //         }

    //         return t;
    //     });

    //     return this.save(targets);
    // }
    
}

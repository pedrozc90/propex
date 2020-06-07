import { EntityRepository } from "@tsed/typeorm";
import { Exception } from "@tsed/exceptions";

import { GenericRepository } from "./generics/GenericRepository";
import { Target, Project } from "../entities";
import { AgeRange } from "../types";

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
     * Overwrite the targets of a project.
     * @param project                       -- selected project.
     * @param targets                       -- list of targets.
     */
    public async overwrite(project: Project, targets: Target[]): Promise<Target[]> {
        // select project targets from database.
        const savedTargets = await this.find({
            join: {
                alias: "pt",
                innerJoinAndSelect: { project: "pt.project" }
            },
            where: { project: { id: project.id } }
        });

        if (!targets) {
            throw new Exception(404, "Targets not found!");
        }

        // merge targets changes.
        savedTargets.map((t) => {
            const f = targets.find((pt) => pt.ageRange === t.ageRange);
            if (f) {
                t.menNumber = f.menNumber;
                t.womenNumber = f.womenNumber;
            }
            return t;
        });

        return this.save(targets);
    }
    
}

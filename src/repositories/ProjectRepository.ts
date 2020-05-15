import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Project, ProjectTarget } from "../entities";
import { AgeRange } from "../types";
import { AgeRangeEnumTransformer } from "../utils";

const relations = [
    "disclosureMedias",
    "eventPresentations",
    "evaluations",
    "futureDevelopmentPlans",
    "partners",
    "demands",
    "publications",
    "projectHumanResources",
    "projectPublics",
    "projectTargets",
    "projectThemeAreas",
    "activities",
    "extensionLines",
    "knowledgeAreas",
    "attachments"
];

@EntityRepository(Project)
export class ProjectRepository extends GenericRepository<Project> {

    constructor() {
        super(relations);
    }

    public async init(): Promise<Project> {
        // delete all projects
        await this.delete({});

        // find one
        let p = await this.findOne({});
        if (!p) {
            p = new Project();
            p.title = "Test";
            p.program = "Class Assigment, Evalutaion Ativity";
            p.startSeason = "2020/01";
            
            // p.includedCourses = "Computer Science";
            // p.ppcAndCourseCalendar = "???";
            // p.requiredCoursesCredits = "Software Engineering";
            // p.infrastructure = "Free for all";
            // p.publicParticipation = "None";
            // p.accompanimentAndEvaluation = "Bad";
            
            // p.disclosureMedias = [];
            // p.eventPresentations = [];
            // p.evaluations = [];
            // p.futureDevelopmentPlans = [];
            // p.partners = [];
            // p.demands = [];
            // p.publications = [];
            // p.projectHumanResources = [];
            // p.projectPublics = [];
            // p.projectTargets = [];
            // p.projectThemeAreas = [];
            // p.activities = [];
            // p.extensionLines = [];
            // p.knowledgeAreas = [];
            // p.attachments = [];
        }
        return this.save(p);
    }

    public async customCreate(project: Project): Promise<any> {
        project.projectTargets = this.populateTargets(project, project.projectTargets);
        return project;
    }

    private populateTargets(project: Project, targets: ProjectTarget[]): ProjectTarget[] {
        const array: ProjectTarget[] = Object.keys(AgeRange).map((key: string) => {
            const t = new ProjectTarget();
            t.ageRange = AgeRangeEnumTransformer.from(key);
            t.project = project;
            return t;
        });

        if (targets) {
            array.map((a: ProjectTarget) => {
                const tmp = targets.filter((t) => t.ageRange === a.ageRange)[0];
                if (tmp?.id) a.id = tmp.id;
                a.menNumber = tmp?.menNumber || 0;
                a.womenNumber = tmp?.womenNumber || 0;
                return a;
            });
        }

        return array;
    }

}

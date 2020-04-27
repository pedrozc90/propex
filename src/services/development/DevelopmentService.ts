import { Service } from "@tsed/di";

import * as Repo from "../../repositories";
import { Project, ProjectHumanResource } from "../../entities";
import { $log } from "@tsed/common";
import { CollaboratorRepository } from "../../repositories";
import { response } from "express";

@Service()
export class DevelopmentService {

    constructor(
        private ActivityRepository: Repo.ActivityRepository,
        private AttachmentRepository: Repo.AttachmentRepository,
        private CollaboratorRepository: Repo.CollaboratorRepository,
        private DemandRepository: Repo.DemandRepository,
        private DisclosureMediaRepository: Repo.DisclosureMediaRepository,
        private EvaluationRepository: Repo.EvaluationRepository,
        private EventPresentationRepository: Repo.EventPresentationRepository,
        private ExtensionLineRepository: Repo.ExtensionLineRepository,
        private FutureDevelopmentPlanRepository: Repo.FutureDevelopmentPlanRepository,
        private KnowledgeAreaRepository: Repo.KnowledgeAreaRepository,
        private PartnerRepository: Repo.PartnerRepository,
        private ProjectRepository: Repo.ProjectRepository,
        private ProjectHumanResourceRepository: Repo.ProjectHumanResourceRepository,
        private ProjectPublicRepository: Repo.ProjectPublicRepository,
        private ProjectTargetRepository: Repo.ProjectTargetRepository,
        private ProjectThemeAreaRepository: Repo.ProjectThemeAreaRepository,
        private PublicRepository: Repo.PublicRepository,
        private PublicationRepository: Repo.PublicationRepository,
        private StudentRepository: Repo.StudentRepository,
        private ThemeAreaRepository: Repo.ThemeAreaRepository,
        private UserRepository: Repo.UserRepository) {
        // initialize stuff here
    }

    public async $onReady(): Promise<any> {
        const users = await this.UserRepository.find({});
        const knowledgeAreas = await this.KnowledgeAreaRepository.find({});
        const themeAreas = await this.ThemeAreaRepository.find({});
        const extensionLines = await this.ExtensionLineRepository.find({});
        const collaborators = await this.CollaboratorRepository.find({});
        const students = await this.StudentRepository.find({});

        // let project = new Project();
        // project.title = "Debug";
        // project.program = "Debug";
        // project.startSeason = "2020/01";
        // project.includedCourses = "Ciências da Computação";
        // project.ppcAndCourseCalendar = "ok";
        // project.requiredCoursesCredits = "nenhum";
        // project.infrastructure = "nenhuma";
        // project.publicParticipation = "nenhum";
        // project.accompanimentAndEvaluation = "nenhum";
        // // project.disclosureMedias = [];
        // // project.eventPresentations = [];
        // // project.evaluations = [];
        // // project.futureDevelopmentPlans = [];
        // // project.partners = [];
        // // project.demands = [];
        // // project.publications = [];
        // // project.projectHumanResources = [];
        // // project.projectPublics = [];
        // // project.projectTargets = [];
        // // project.projectThemeAreas = [];
        // // project.activities = [];
        // // project.extensionLines = [];
        // // project.knowledgeAreas = [
        // //     knowledgeAreas[3],
        // //     knowledgeAreas[5]
        // // ];
        // // project.attachments = [];

        // project = await this.ProjectRepository.save(project);
        let project = await this.ProjectRepository.findOne(3);

        if (project) {
            const x = new ProjectHumanResource();
            x.project = project;
            x.coordinate = true;
            x.exclusive = true;
            x.collaborator = collaborators[0];
            x.dateAdmission = "2020-02-20";
            x.workload = 2;

            const y = new ProjectHumanResource();
            y.project = project;
            y.coordinate = false;
            y.exclusive = false;
            y.student = students[0];
            y.dateAdmission = "2020-03-20";
            y.workload = 2;

            const z = new ProjectHumanResource();
            z.project = project;
            z.coordinate = false;
            z.exclusive = false;
            z.student = students[1];
            z.dateAdmission = "2020-04-20";
            z.workload = 2;

            const resources = await this.ProjectHumanResourceRepository.save([ x, y, z ]);
            console.log(resources);

            project.knowledgeAreas = [ knowledgeAreas[3], knowledgeAreas[5] ];
            project.extensionLines = [ extensionLines[2] ];

            project = await this.ProjectRepository.save(project);
        }

        console.log(project);
        return {};
    }

}

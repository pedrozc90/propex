import { Service } from "@tsed/di";
import { MoreThan, EntityManager } from "typeorm";

import * as Repo from "../../repositories";
import { Scope, AgeRange } from "../../types";
import { AgeRangeEnumTransformer } from "../../utils";
import { ProjectRepository } from "../../repositories";
import { ThemeArea } from "../../entities";

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
        const users = await this.UserRepository.find({ where: { id: MoreThan(1) } });

        const collaborators = await this.CollaboratorRepository.find({});
        const students = await this.StudentRepository.find({});

        const knowledgeAreas = await this.KnowledgeAreaRepository.find({});
        const extensionLines = await this.ExtensionLineRepository.find({});

        // transational example
        // const ta = new ThemeArea();
        // ta.name = "Debug";

        // this.ProjectRepository.manager.transaction(async (em: EntityManager) => {
        //     await em.save(ta);
        // });

        return {};
    }

}

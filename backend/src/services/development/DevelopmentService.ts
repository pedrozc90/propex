import { Service } from "@tsed/di";

import * as Repo from "../../repositories";
import { AgeRangeEnum } from "../../types";
import { ExtensionLine } from "src/entities";

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
        private HumanResourceTypeRepository: Repo.HumanResourceTypeRepository,
        private KnowledgeAreaRepository: Repo.KnowledgeAreaRepository,
        private PartnerRepository: Repo.PartnerRepository,
        private PermissionRepository: Repo.PermissionRepository,
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
        const extensionLines = await this.ExtensionLineRepository.init();
        const humanResourceTypes = await this.HumanResourceTypeRepository.init();
        const publics = await this.PublicRepository.init();
        const knowledgeAreas = await this.KnowledgeAreaRepository.init();

        // const knowledgeAreas = await this.KnowledgeAreaRepository.init();
        // console.log(knowledgeAreas);

        const user = await this.UserRepository.init();
        console.log(user);

        // const permissions = await this.PermissionRepository.init();
        // console.log(permissions);

        // const collaborators = await this.CollaboratorRepository.init(user);
        // console.log(collaborators);

        // user.permissions = permissions;
        // user = await this.UserRepository.save(user);

        // // await this.userRepository.createQueryBuilder("usr").relation(User, "permissions").of(user).remove(permissions[1]);
        // // await this.userRepository.createQueryBuilder("usr").relation(User, "permissions").of(user).remove(permissions[0]);
        // // await this.permissionRepository.delete(permissions[1].id);

        const project = await this.ProjectRepository.init();
        console.log(project);

        // const medias = await this.DisclosureMediaRepository.init(project);
        // console.log(medias);

        // const events = await this.EventPresentationRepository.init(project);
        // console.log(events);

        // const lines = await this.ExtensionLineRepository.init();
        // console.log(lines);

        // const evaluations = await this.EvaluationRepository.init(project);
        // console.log(evaluations);

        // const futurePlans = await this.FutureDevelopmentPlanRepository.init(project);
        // console.log(futurePlans);

        // const hrTypes = await this.HumanResourceTypeRepository.init();
        // console.log(hrTypes);

        // const publics = await this.PublicRepository.init();
        // console.log(publics);

        // const projectTargets = await this.ProjectTargetRepository.init(project);
        // console.log(projectTargets);

        return {};
    }

}

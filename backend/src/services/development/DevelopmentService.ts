/* eslint-disable object-curly-newline */
import { Service } from "@tsed/di";
import { $log } from "@tsed/common";

import {
    ActivityRepository,
    AttachmentRepository,
    CollaboratorRepository,
    DemandRepository,
    DisclosureMediaRepository,
    EvaluationRepository,
    EventPresentationRepository,
    ExtensionLineRepository,
    FutureDevelopmentPlanRepository,
    HumanResourceTypeRepository,
    KnowledgeAreaRepository,
    PartnerRepository,
    PermissionRepository,
    ProjectRepository,
    ProjectAttachmentRepository,
    ProjectHumanResourceRepository,
    ProjectPublicRepository,
    ProjectTargetRepository,
    ProjectThemeAreaRepository,
    PublicRepository,
    PublicationRepository,
    StudentRepository,
    ThemeAreaRepository,
    UserRepository
} from "../../repositories";
import { TransformerAgeRangeEnum } from "../../utils";
import { AgeRangeEnum } from "../../types";

@Service()
export class DevelopmentService {

    constructor(
        private ActivityRepository: ActivityRepository,
        private AttachmentRepository: AttachmentRepository,
        private CollaboratorRepository: CollaboratorRepository,
        private DemandRepository: DemandRepository,
        private DisclosureMediaRepository: DisclosureMediaRepository,
        private EvaluationRepository: EvaluationRepository,
        private EventPresentationRepository: EventPresentationRepository,
        private ExtensionLineRepository: ExtensionLineRepository,
        private FutureDevelopmentPlanRepository: FutureDevelopmentPlanRepository,
        private HumanResourceTypeRepository: HumanResourceTypeRepository,
        private KnowledgeAreaRepository: KnowledgeAreaRepository,
        private PartnerRepository: PartnerRepository,
        private PermissionRepository: PermissionRepository,
        private ProjectRepository: ProjectRepository,
        private ProjectAttachmentRepository: ProjectAttachmentRepository,
        private ProjectHumanResourceRepository: ProjectHumanResourceRepository,
        private ProjectPublicRepository: ProjectPublicRepository,
        private ProjectTargetRepository: ProjectTargetRepository,
        private ProjectThemeAreaRepository: ProjectThemeAreaRepository,
        private PublicRepository: PublicRepository,
        private PublicationRepository: PublicationRepository,
        private StudentRepository: StudentRepository,
        private ThemeAreaRepository: ThemeAreaRepository,
        private UserRepository: UserRepository) {
        // initialize stuff here
    }

    public async $onReady(): Promise<any> {
        const knowledgeAreas = await this.KnowledgeAreaRepository.init();
        console.log(knowledgeAreas);

        let user = await this.UserRepository.init();
        console.log(user);

        const permissions = await this.PermissionRepository.init();
        console.log(permissions);

        const collaborators = await this.CollaboratorRepository.init(user);
        console.log(collaborators);

        user.permissions = permissions;
        user = await this.UserRepository.save(user);

        // await this.userRepository.createQueryBuilder("usr").relation(User, "permissions").of(user).remove(permissions[1]);
        // await this.userRepository.createQueryBuilder("usr").relation(User, "permissions").of(user).remove(permissions[0]);
        // await this.permissionRepository.delete(permissions[1].id);

        const project = await this.ProjectRepository.init();
        console.log(project);

        const medias = await this.DisclosureMediaRepository.init(project);
        console.log(medias);

        const events = await this.EventPresentationRepository.init(project);
        console.log(events);

        const lines = await this.ExtensionLineRepository.init();
        console.log(lines);

        const evaluations = await this.EvaluationRepository.init(project);
        console.log(evaluations);

        const futurePlans = await this.FutureDevelopmentPlanRepository.init(project);
        console.log(futurePlans);

        const hrTypes = await this.HumanResourceTypeRepository.init();
        console.log(hrTypes);

        const publics = await this.PublicRepository.init();
        console.log(publics);

        const projectTargets = await this.ProjectTargetRepository.init(project);
        console.log(projectTargets);

        $log.info(TransformerAgeRangeEnum.from(AgeRangeEnum.OLDER_THAN_70));
        $log.info(TransformerAgeRangeEnum.to("Até 18 anos"));
        $log.info(TransformerAgeRangeEnum.to("FROM_61_TO_70"));

        return {};
    }

}

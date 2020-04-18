/* eslint-disable object-curly-newline */
import { Service } from "@tsed/di";

import {
    UserRepository,
    PermissionRepository,
    CollaboratorRepository,
    ProjectRepository,
    DisclosureMediaRepository,
    EventPresentationRepository,
    ExtensionLineRepository,
    EvaluationRepository,
    FutureDevelopmentPlanRepository,
    HumanResourceTypeRepository,
    PartnerRepository,
    KnowledgeAreaRepository
} from "../../repositories";

@Service()
export class DevelopmentService {

    constructor(
        private userRepo: UserRepository,
        private permissionRepo: PermissionRepository,
        private collaboratorRepo: CollaboratorRepository,
        private projectRepo: ProjectRepository,
        private disclosureMediaRepo: DisclosureMediaRepository,
        private eventRepo: EventPresentationRepository,
        private extensionRepo: ExtensionLineRepository,
        private evaluationRepo: EvaluationRepository,
        private futurePlanRepo: FutureDevelopmentPlanRepository,
        private humanResourceTypeRepo: HumanResourceTypeRepository,
        private partnerRepo: PartnerRepository,
        private knowledgeAreaRepo: KnowledgeAreaRepository) {
        // initialize stuff here
    }

    public async $onReady(): Promise<any> {
        const knowledgeAreas = await this.knowledgeAreaRepo.init();
        console.log(knowledgeAreas);

        let user = await this.userRepo.init();
        console.log(user);

        const permissions = await this.permissionRepo.init();
        console.log(permissions);

        const collaborators = await this.collaboratorRepo.init(user);
        console.log(collaborators);

        user.permissions = permissions;
        user = await this.userRepo.save(user);

        // await this.userRepo.createQueryBuilder("usr").relation(User, "permissions").of(user).remove(permissions[1]);
        // await this.userRepo.createQueryBuilder("usr").relation(User, "permissions").of(user).remove(permissions[0]);
        // await this.permissionRepo.delete(permissions[1].id);

        const project = await this.projectRepo.init();
        console.log(project);

        const medias = await this.disclosureMediaRepo.init(project);
        console.log(medias);

        const events = await this.eventRepo.init(project);
        console.log(events);

        const lines = await this.extensionRepo.init();
        console.log(lines);

        const evaluations = await this.evaluationRepo.init(project);
        console.log(evaluations);

        const futurePlans = await this.futurePlanRepo.init(project);
        console.log(futurePlans);

        const hrTypes = await this.humanResourceTypeRepo.init();
        console.log(hrTypes);
    }

}

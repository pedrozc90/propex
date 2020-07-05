import { $log, Service, Inject } from "@tsed/common";
import { MoreThan, EntityManager } from "typeorm";

import * as Repo from "../../../repositories";
import { TypeORMConnection } from "../../providers/TypeORMConnection";
import { User } from "../../../entities";

@Service()
export class DevelopmentService {

    constructor(
        // repositories
        private ActivityRepository: Repo.ActivityRepository,
        private AttachmentRepository: Repo.AttachmentRepository,
        private CollaboratorRepository: Repo.CollaboratorRepository,
        private DemandRepository: Repo.DemandRepository,
        private DisclosureMediaRepository: Repo.DisclosureMediaRepository,
        private EvaluationRepository: Repo.EvaluationRepository,
        private EventRepository: Repo.EventRepository,
        private ExtensionLineRepository: Repo.ExtensionLineRepository,
        private FutureDevelopmentPlanRepository: Repo.FutureDevelopmentPlanRepository,
        private KnowledgeAreaRepository: Repo.KnowledgeAreaRepository,
        private PartnerRepository: Repo.PartnerRepository,
        private ProjectRepository: Repo.ProjectRepository,
        private ProjectHumanResourceRepository: Repo.ProjectHumanResourceRepository,
        private ProjectPublicRepository: Repo.ProjectPublicRepository,
        private TargetRepository: Repo.TargetRepository,
        private ProjectThemeAreaRepository: Repo.ProjectThemeAreaRepository,
        private PublicRepository: Repo.PublicRepository,
        private PublicationRepository: Repo.PublicationRepository,
        private StudentRepository: Repo.StudentRepository,
        private ThemeAreaRepository: Repo.ThemeAreaRepository,
        private UserRepository: Repo.UserRepository,
        // connection
        @Inject(TypeORMConnection) private connection: TypeORMConnection) {
        // initialize stuff here
    }

    public async $onReady(): Promise<any> {
        // const users = await this.UserRepository.find({ where: { id: MoreThan(1) } });

        // const collaborators = await this.CollaboratorRepository.find({});
        // const students = await this.StudentRepository.find({});

        // const knowledgeAreas = await this.KnowledgeAreaRepository.find({});
        // const extensionLines = await this.ExtensionLineRepository.find({});

        // testing transactions
        // await this.connection.manager.transaction("SERIALIZABLE", async (em: EntityManager) => {
        //     let userA = new User();
        //     userA.name = "User A";
        //     userA.email = "user-a@email.com";
        //     userA.password = "123456";
        //     userA.phone = "(00) 0000-0000";

        //     userA = await em.save(User, userA);     // id = 1
        //     $log.debug("USER A:", userA);

        //     const userB = new User();
        //     userB.name = "User B";
        //     userB.email = "user-a@email.com";
        //     userB.password = "123456";
        //     userB.phone = "(00) 0000-0000";

        //     await em.createQueryBuilder().insert().into(User).values(userB).execute();
        //     $log.debug("USER B:", userB);
        // }).catch((error) => $log.error(error.message));

        // await this.connection.manager.transaction("SERIALIZABLE", async (em: EntityManager) => {
        //     let userC = new User();
        //     userC.name = "User C";
        //     userC.email = "user-c@email.com";
        //     userC.password = "123456";
        //     userC.phone = "(00) 0000-0000";

        //     userC = await em.save(User, userC);     // id = 3
        //     $log.debug("USER C:", userC);
        // }).catch((error) => $log.error(error.message));
    }

}

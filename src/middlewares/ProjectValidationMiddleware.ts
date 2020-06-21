import { EndpointInfo, IMiddleware, Middleware, Next, Req, Res, ParamMetadata, ParamTypes, Locals } from "@tsed/common";

import { Context } from "../core/models";
import { ProjectRepository } from "../repositories";

@Middleware()
export class ProjectValidationMiddleware implements IMiddleware {

    constructor(private projectRepository: ProjectRepository) {}

    /**
     * Retrieve token from headers and check request authorization.
     * @param request   -- express request object.
     * @param endpoint  -- express endpoint.
     */
    public async use(
        @Req() request: Req,
        @Res() response: Res,
        @Next() next: Next,
        @EndpointInfo() endpoint: EndpointInfo,
        @Locals("context") context: Context
    ): Promise<void> {
        // check if endpoint has projectId as path params.
        const params = endpoint.params.filter((p: ParamMetadata) => p.paramType === ParamTypes.PATH && p.expression === "projectId");
        
        // if true, verify if user is part of project.
        if (params.length > 0) {
            const projectId = JSON.parse(request.params.projectId);
            console.log(projectId);

            const project = await this.projectRepository.findByContext(projectId, context);
            
            response.locals.project = project;
        }

        // go the next middleware/endpoint
        next();
    }

}

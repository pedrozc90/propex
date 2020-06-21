import { UseAuth } from "@tsed/common";
import { applyDecorators } from "@tsed/core";
import { Operation, Responses, Security } from "@tsed/swagger";

import { AuthenticatedMiddleware } from "../../../middlewares/AuthenticatedMiddleware";
import { IAuthenticatedOptions } from "../../types";

export function Authenticated(options: IAuthenticatedOptions = {}): Function {
    return applyDecorators(
        UseAuth(AuthenticatedMiddleware, options),
        Security("http", ...(options.scope || [])),
        Operation({
            parameters: [
                {
                    in: "header",
                    name: "Authorization",
                    type: "string",
                    required: true
                }
            ]
        }),
        Responses(401, { description: "Unauthorized" }),
        Responses(403, { description: "Forbidden" })
    );
}

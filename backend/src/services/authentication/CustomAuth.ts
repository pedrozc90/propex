import { UseAuth } from "@tsed/common";
import { applyDecorators } from "@tsed/core";
import { Operation, Responses, Security } from "@tsed/swagger";

import { ICustomAuthOptions } from "../../types/types";
import { CustomAuthMiddleware } from "../../middlewares/CustomAuthMiddleware";

export function CustomAuth(options: ICustomAuthOptions = {}): Function {
    return applyDecorators(
        UseAuth(CustomAuthMiddleware, options),
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

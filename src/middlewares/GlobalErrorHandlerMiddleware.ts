import { Middleware, Err, Req, Res } from "@tsed/common";
import { Exception } from "ts-httpexceptions";

@Middleware()
export class GlobalErrorHandlerMiddlware {

    public use(@Err() error: any, @Req() request: Req, @Res() response: Res): any {
        if (response.headersSent) {
            throw error;
        }

        if (error instanceof Exception) {
            response.status(error.status).json({
                error: {
                    status: error.status,
                    message: error.message,
                    name: error.name
                }
            });
            return;
        }

        if (typeof error === "string") {
            response.status(404).send({
                error: {
                    status: 404,
                    message: error
                }
            });
            return;
        }

        response.status(error.status || 500).send({
            error: {
                status: 500,
                message: "Internal Error"
            }
        });
    }

}

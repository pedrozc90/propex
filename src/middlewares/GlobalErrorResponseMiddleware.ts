import { Constant, Err, Req, Res, IResponseError, OverrideMiddleware, GlobalErrorHandlerMiddleware, IMiddleware } from "@tsed/common";
import { Exception } from "@tsed/exceptions";

@OverrideMiddleware(GlobalErrorHandlerMiddleware)
export class GlobalErrorResponseMiddleware implements IMiddleware {

    @Constant("errors.headerName", "errors")
    protected headerName: string;

    public use(@Err() error: any, @Req() request: Req, @Res() response: Res): any {
        const logger = request.ctx.logger;

        if (error instanceof Exception || error.status) {
            logger.error({
                error: {
                    message: error.message,
                    stack: error.stack,
                    status: error.status,
                    origin: error.origin
                }
            });

            this.setHeaders(response, error, error.origin);

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

        logger.error({
            error: {
                status: 500,
                message: error.message,
                stack: error.stack,
                origin: error.origin
            }
        });

        this.setHeaders(response, error, error.origin);

        response.status(error.status || 500).send({
            error: {
                status: 500,
                message: "Internal Error"
            }
        });

        // return;
    }

    private setHeaders(response: Res, ...args: IResponseError[]) {
        let hErrors: any = [];

        args
            .filter(o => !!o)
            .forEach(({ headers, errors }: IResponseError) => {
                if (headers) {
                    response.set(headers);
                }

                if (errors) {
                    hErrors = hErrors.concat(errors);
                }
            });

        if (hErrors.length) {
            response.set(this.headerName, JSON.stringify(hErrors));
        }
    }

}

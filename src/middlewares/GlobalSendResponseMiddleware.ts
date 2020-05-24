import { ConverterService, IMiddleware, OverrideMiddleware, Req, Res, SendResponseMiddleware } from "@tsed/common";
import { isBoolean, isNumber, isStream, isString } from "@tsed/core";

import { ResultContent } from "../entities";

@OverrideMiddleware(SendResponseMiddleware)
export class GlobalSendResponseMiddleware implements IMiddleware {

    constructor(protected converterService: ConverterService) {}

    public use(@Req() request: Req, @Res() response: Res) {
        const { data, endpoint } = request.ctx;
        if (data === undefined) {
            return response.send();
        }

        if (isStream(data)) {
            data.pipe(response);
            return response;
        }

        if (isBoolean(data) || isNumber(data) || isString(data) || data === null) {
            return response.send(ResultContent.of(data));
        }

        const content = (data instanceof ResultContent) ? data : ResultContent.of<any>(data);

        return response.json(this.converterService.serialize(content, { type: endpoint.type }));
    }

}

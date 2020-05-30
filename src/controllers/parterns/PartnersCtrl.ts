import { Controller, Get, PathParams, Delete } from "@tsed/common";

import { PartnerRepository } from "../../repositories";
import { Partner } from "../../entities";

@Controller("/partners")
export class PartnerCtrl {

    constructor(private partnerRepository: PartnerRepository) {}

    @Get("/:id")
    public async get(@PathParams("id") id: number): Promise<Partner | undefined> {
        return this.partnerRepository.findById(id);
    }

    @Delete("/:id")
    public async delete(@PathParams("id") id: number): Promise<any> {
        return this.partnerRepository.deleteById(id);
    }

}

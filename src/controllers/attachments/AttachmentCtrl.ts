import { Controller, Get, PathParams, Delete, Locals, QueryParams, Post, Res, BodyParams } from "@tsed/common";
import { NotFound, BadRequest } from "@tsed/exceptions";
import { MultipartFile } from "@tsed/multipartfiles";

import { Authenticated } from "../../core/services";
import { AttachmentRepository } from "../../repositories";
import { Attachment, Page } from "../../entities";
import { Context } from "../../core/models";
import { ParseUtils, StringUtils } from "../../core/utils";

import fs from "fs";

@Controller("/attachments")
export class AttachmentCtrl {

    constructor(private attachmentRepository: AttachmentRepository) {}

    /**
     * Return a list of attachments.
     * @param context                       -- user context.
     * @param project                       -- project id.
     */
    @Get("")
    @Authenticated({})
    public async fetch(
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string,
        @QueryParams("project") projectId?: number,
        @QueryParams("publication") publicationId?: number,
        @QueryParams("activity") activityId?: number
    ): Promise<Page<Attachment>> {
        const attachements = await this.attachmentRepository.fetch({ page, rpp, q, projectId, publicationId, activityId });
        return Page.of<Attachment>(attachements, page, rpp);
    }

    /**
     * Save/Update a Activity.
     * @param context                       -- user context.
     * @param Activitys                   -- Activity data.
     */
    @Post("")
    @Authenticated({})
    public async save(
        @Locals("context") context: Context,
        @BodyParams("id") id?: number,
        @BodyParams("url") url?: string,
        @MultipartFile("file") file?: Express.Multer.File
    ): Promise<any> {
        if (!url && !file) {
            throw new BadRequest("Please, body do not contains an url or file.");
        }

        let attachment = await this.attachmentRepository.createQueryBuilder("att")
            .leftJoin("att.projects", "p")
            .leftJoin("att.publications", "pb")
            .leftJoin("att.activities", "act")
            .where("att.id = :id", { id })
            .getOne();
        
        if (!attachment) {
            attachment = new Attachment();
        }

        if (url) {
            attachment.url = url;
        }

        if (file) {
            attachment.size = file.size;
            attachment.filename = file.originalname;
            attachment.filenameNormalized = StringUtils.normalize(file.originalname);
            attachment.contentType = file.mimetype;
            attachment.content = fs.readFileSync(file.path);
            attachment.extension = ParseUtils.extractFileExtension(file.originalname);
        }

        attachment = await this.attachmentRepository.save(attachment);

        if (file && file.path) {
            // delete file from .temp file
            fs.unlinkSync(file.path);
        }

        return attachment;
    }

    /**
     * Search a attachment by id.
     * @param id                            -- attachment id.
     */
    @Get("/:id")
    public async get(@PathParams("id") id: number): Promise<Attachment | undefined> {
        return this.attachmentRepository.findById(id);
    }

    /**
     * Download attachment file.
     * @param id                            -- attachment id.
     */
    @Get("/:id/download")
    public async download(
        @PathParams("id") id: number,
        @Res() response: Res
    ): Promise<any | undefined> {
        const attachment = await this.attachmentRepository.findById(id);
        if (!attachment) {
            throw new NotFound("Attachment not found.");
        }
        if (!attachment.content) {
            throw new NotFound("Attachment do not have content to download.");
        }
        // let content = Buffer.from(attachment.content, "base64");
        response.writeHead(200, {
            "Content-Type": attachment.contentType,
            "Content-Disposition": `attachment; filename=${attachment.filename}`,
            "Content-Length": attachment.size
        });
        response.write(attachment.content);
    }

    /**
     * Delete a attachement.
     * @param id                            -- attachment id.
     */
    @Delete("/:id")
    public async delete(@PathParams("id") id: number): Promise<any> {
        return this.attachmentRepository.deleteById(id);
    }

}

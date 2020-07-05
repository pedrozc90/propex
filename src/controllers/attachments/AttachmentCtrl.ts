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

    constructor(
        private attachmentRepository: AttachmentRepository) {
        // initialize your stuffs here.
    }

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

        let attachment = await this.attachmentRepository.findInfo(id);
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

        // ignore property is not working
        delete attachment.content;
        delete attachment.projects;
        delete attachment.publications;
        delete attachment.activities;

        // return saved attachment
        return attachment;
    }

    /**
     * Search a attachment by id.
     * @param id                            -- attachment id.
     */
    @Get("/:id")
    @Authenticated({})
    public async get(@PathParams("id") id: number): Promise<Attachment | undefined> {
        const attachment = await this.attachmentRepository.findById(id);
        if (!attachment) {
            throw new NotFound("Attachment not founc.");
        }

        // ignore property is not working
        delete attachment.content;
        delete attachment.projects;
        delete attachment.publications;
        delete attachment.activities;

        // return saved attachment
        return attachment;
    }

    /**
     * Download attachment file.
     * @param id                            -- attachment id.
     */
    @Get("/:id/download")
    @Authenticated({})
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
        
        // update response headers
        response.writeHead(200, {
            "Content-Type": attachment.contentType,
            "Content-Disposition": `attachment; filename=${attachment.filename}`,
            "Content-Length": attachment.size
        });

        // send file
        response.write(attachment.content);
    }

    /**
     * Delete a attachement.
     * @param id                            -- attachment id.
     */
    @Delete("/:id")
    @Authenticated({})
    public async delete(@PathParams("id") id: number): Promise<any> {
        return this.attachmentRepository.erase(id);
    }

}

import { Controller, Get, PathParams, Delete, Required, Locals, QueryParams, Post, Res } from "@tsed/common";
import { NotImplemented, NotFound } from "@tsed/exceptions";
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
        @Locals("context") context: Context,
        @QueryParams("project") projectId: number
    ): Promise<Page<Attachment>> {
        console.log(context.user.email, projectId);
        throw new NotImplemented("Method Not Implemented.");
    }

    /**
     * Save/Update a Activity.
     * @param context                       -- user context.
     * @param Activitys                   -- Activity data.
     */
    @Post("")
    @Authenticated({})
    // @MulterOptions({})
    public async save(
        @Locals("context") context: Context,
        @Required() @MultipartFile("file") file: Express.Multer.File
    ): Promise<Attachment> {
        // create a new attachment
        let attachment = new Attachment();
        attachment.fileSize = file.size;
        attachment.fileName = file.originalname;
        attachment.fileNameNormalized = StringUtils.normalize(file.originalname);
        attachment.contentType = file.mimetype;
        attachment.content = fs.readFileSync(file.path);
        attachment.extension = ParseUtils.extractFileExtension(file.originalname);

        attachment = await this.attachmentRepository.save(attachment);

        // delete file from .temp file
        fs.unlinkSync(file.path);

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
            "Content-Disposition": `attachment; filename=${attachment.fileName}`,
            "Content-Length": attachment.fileSize
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

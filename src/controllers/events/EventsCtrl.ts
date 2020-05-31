import { Controller, Get, PathParams, Delete, Required, Locals, QueryParams, Post, BodyParams } from "@tsed/common";
import { Exception } from "@tsed/exceptions";

import { CustomAuth } from "../../services";
import { EventPresentationRepository, ProjectRepository } from "../../repositories";
import { EventPresentation } from "../../entities";
import { IContext } from "../../types";

@Controller("/events")
export class EventPresentationCtrl {

    constructor(private eventRepository: EventPresentationRepository, private projectRepository: ProjectRepository) {}

    /**
     * Return a list of events.
     * @param context                       -- user context.
     * @param project                       -- project id or title.
     */
    @Get("/")
    @CustomAuth({})
    public async fetch(
        @Locals("context") context: IContext,
        @QueryParams("project") project: number | string,
        @QueryParams("q") q: string
    ): Promise<EventPresentation[]> {
        let query = this.eventRepository.createQueryBuilder("ep")
            .innerJoin("ep.project", "project");

        if (typeof project === "string") {
            query = query.where("project.title LIKE :title", { title: `%${project}%` });
        } else if (typeof project === "number") {
            query = query.where("project.id = : id", { id: project });
        }

        if (q) {
            query = query.where("ep.name LIKE :name", { name: `%${q}%` })
                .orWhere("ep.modality LIKE :modality", { modality: `%${q}%` });
        }

        return query.getMany();
    }

    /**
     * Save/Update a event.
     * @param context                       -- user context.
     * @param events                        -- event data.
     */
    @Post("/")
    @CustomAuth({})
    public async save(
        @Locals("context") context: IContext,
        @Required() @BodyParams("event") event: EventPresentation
    ): Promise<EventPresentation> {
        const project = await this.projectRepository.findByContext(event.project.id, context);
        if (!project) {
            throw new Exception(400, "Project not found.");
        }
        event.project = project;
        return this.eventRepository.save(event);
    }

    /**
     * Search a event by id.
     * @param id                            -- event id.
     */
    @Get("/:id")
    @CustomAuth({})
    public async get(@Required() @PathParams("id") id: number): Promise<EventPresentation | undefined> {
        return this.eventRepository.findById(id);
    }

    /**
     * Delete a event.
     * @param id                            -- event id.
     */
    @Delete("/:id")
    @CustomAuth({})
    public async delete(@Required() @PathParams("id") id: number): Promise<any> {
        return this.eventRepository.deleteById(id);
    }

}

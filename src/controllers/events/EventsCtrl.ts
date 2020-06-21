import { Controller, Get, PathParams, Delete, Required, Locals, QueryParams, Post, BodyParams, Req, Put } from "@tsed/common";
import { BadRequest, NotFound } from "@tsed/exceptions";

import { Authenticated } from "../../core/services";
import { EventRepository, ProjectRepository } from "../../repositories";
import { Event, Page } from "../../entities";
import { IContext } from "../../core/types";

@Controller("/events")
export class EventCtrl {

    constructor(private eventRepository: EventRepository, private projectRepository: ProjectRepository) {}

    /**
     * Return a list of events.
     * @param context                       -- user context.
     * @param project                       -- project id or title.
     */
    @Get("")
    @Authenticated({})
    public async fetch(
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string,
        @QueryParams("project") projectId?: number
    ): Promise<Page<Event>> {
        return this.eventRepository.fetch(page, rpp, q, projectId);
    }

    /**
     * Save/Update a event.
     * @param request                       -- express request object.
     * @param context                       -- user context.
     * @param events                        -- event data.
     */
    @Post("")
    @Authenticated({})
    public async save(
        @Req() request: Req,
        @Locals("context") context: IContext,
        @Required() @BodyParams("event") event: Event
    ): Promise<Event> {
        if (event.id) {
            throw new BadRequest(`Please use PUT ${request.path} to modify event entities.`);
        }

        const project = await this.projectRepository.findByContext(event.project.id, context);

        event.project = project;
        return this.eventRepository.save(event);
    }

    /**
     * Save/Update a event.
     * @param request                       -- express request object.
     * @param context                       -- user context.
     * @param events                        -- event data.
     */
    @Put("")
    @Authenticated({})
    public async update(@Required() @BodyParams("event") data: Event): Promise<Event> {
        let event = await this.eventRepository.findOne(data.id, { relations: [ "project" ] });
        if (!event) {
            throw new NotFound("Event not found.");
        }

        event = this.eventRepository.merge(event, data);
        
        return this.eventRepository.save(event);
    }

    /**
     * Search a event by id.
     * @param id                            -- event id.
     */
    @Get("/:id")
    @Authenticated({})
    public async get(@Required() @PathParams("id") id: number): Promise<Event | undefined> {
        return this.eventRepository.findById(id);
    }

    /**
     * Delete a event.
     * @param id                            -- event id.
     */
    @Delete("/:id")
    @Authenticated({})
    public async delete(@Required() @PathParams("id") id: number): Promise<any> {
        return this.eventRepository.deleteById(id);
    }

}

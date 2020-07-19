import { axiosInstance } from "../../boot/axios";
import { Page } from "../models";
import { IOptions } from "../types";
import { AxiosResponse } from "axios";

export default class BasicService<T> {

    constructor(public readonly url: string) {}

    public async findById(id: number): Promise<T | null> {
        return await axiosInstance.get<T>(`${this.url}/${id}`)
            .then((response: AxiosResponse) => (response) ? response.data : null);
    }

    // public async fetch(params: IOptions): Promise<Page<T> | null> {
    //     return await axiosInstance.get<T>(this.url, { params: params })
    //         .then((response: AxiosResponse) => (response) ? response.data.content : null);
    // }

    public async get(id: number): Promise<T> {
        if (!id) {
            throw new Error("Invalid id");
        }
        return await axiosInstance.get(`${this.url}/${id}`)
            .then((response: AxiosResponse) => (response) ? response.data.content : null);
    }

    public async remove(id: number): Promise<unknown> {
        if (!id) return null;
        return await axiosInstance.delete(`${this.url}/${id}`)
            .then((response: AxiosResponse) => response);
    }
    
}

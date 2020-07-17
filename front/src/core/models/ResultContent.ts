/* eslint-disable @typescript-eslint/no-explicit-any */
export class ResultContent<T> {

    public code?: number;
    public message?: string;
    public content?: T;

    public static of<T>(content?: T): ResultContent<T> {
        const result: ResultContent<T> = new ResultContent<T>();
        result.content = content;
        return result;
    }

    public withMessage(message?: string): ResultContent<T> {
        if (message) this.message = message;
        return this;
    }

    public withContent(content?: T): ResultContent<T> {
        if (content) this.content = content;
        return this;
    }

    public put(key: string, value?: T): ResultContent<T> {
        if (value) (this as any)[key] = value;
        return this;
    }

}

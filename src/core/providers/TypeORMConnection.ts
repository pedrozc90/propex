import { registerProvider, Configuration } from "@tsed/di";
import { Connection, ConnectionOptions } from "typeorm";
import { createConnection } from "@tsed/typeorm";

export const TypeORMConnection = Symbol.for("Connection");             // declare your own symbol.
export type TypeORMConnection = Connection;                            // set alias types (optional)

const TypeORMConnectionName = "default";                              // change the name according to your server configuration.

registerProvider({
    provide: TypeORMConnection,
    deps: [ Configuration ],
    async useAsyncFactory(configuration: Configuration): Promise<Connection> {
        const settings = configuration.get<ConnectionOptions[]>("typeorm");
        const connectionOptions = settings.find((s) => s.name === TypeORMConnectionName);
        if (!connectionOptions) {
            throw new Error("TypeORM connection options not found.");
        }
        return createConnection(connectionOptions);
    }
});

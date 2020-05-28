import { GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings } from "@tsed/common";
import "@tsed/swagger";
import "@tsed/typeorm";
import { ConnectionOptions } from "typeorm";

import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import methodOverride from "method-override";

import * as dotenv from "dotenv";
import * as path from "path";

const rootDir = __dirname;
dotenv.config({ path: path.join(__dirname, "../config/dev.env") });

@ServerSettings({
    rootDir,
    acceptMimes: [ "application/json" ],
    port: process.env.PORT || 9000,
    httpsPort: false,
    mount: { "/api": `${rootDir}/controllers/**/*.ts` },
    componentsScan: [
        `${rootDir}/converters/**/*.ts`,
        `${rootDir}/middlewares/**/*.ts`,
        `${rootDir}/services/**/*.ts`
    ],
    statics: { "/static": `${rootDir}/static` },
    logger: {
        debug: true,
        level: "info",
        requestFields: [ "reqId", "method", "url", "headers", "body", "query", "params", "duration" ],
        ignoreUrlPatterns: [ "/api-docs" ],
        logRequest: true,
        logStart: true,
        logEnd: true,
        jsonIndentation: 4
        // reqIdBuilder: () => string,
        // disableRoutesSummary: true,
        // format: "%d %p %c %X{user} %m%n"
    },
    swagger: { path: "/api-docs" },
    typeorm: [
        {
            name: "default",
            type: "mysql",
            host: process.env.DB_URL || "localhost",
            port: process.env.DB_PORT || 3306,
            database: process.env.DB_NAME || "propex",
            username: process.env.DB_USERNAME || "root",
            password: process.env.DB_PASSWORD || "",
            logging: false,
            synchronize: true,
            dropSchema: true,
            entities: [ `${rootDir}/entities/*.ts` ],
            migrations: [ `${rootDir}/migrations/*.ts` ],
            migrationsRun: true,
            subscribers: [ `${rootDir}/subscribers/*.ts` ],
            // debug: [ "query" ],
            charset: "utf8mb4_general_ci",
            timezone: "local",
            extra: { charset: "utf8mb4_general_ci" },
            supportBigNumbers: false,
            bigNumberStrings: true
        } as ConnectionOptions
    ]
})
export class Server extends ServerLoader {

    /**
     * This method let you configure the express middleware required by your application to works.
     * @returns {Server}
     */
    public $beforeRoutesInit(): void | Promise<any> {
        this.use(GlobalAcceptMimesMiddleware)
            .use(cors())
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({ extended: true }));
    }

    // public $onReady(): void {
    //     $log.info("Server initialized");
    // }

    // public $onServerInitError(error: any): void {
    //     $log.info("Server encounter an error => ", error);
    // }

    // public $afterRoutesInit(): void {
    //     // add global middlewares
    //     this.use(middlware);
    // }

}

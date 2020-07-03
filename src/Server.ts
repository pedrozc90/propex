import { GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings } from "@tsed/common";
import "@tsed/multipartfiles";
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

dotenv.config({ path: path.join(__dirname, "../config/dev.env") });

const rootDir: string = __dirname;
const uploadDir: string = process.env.TEMP_DIR || path.join(process.cwd(), ".temp");

@ServerSettings({
    rootDir,
    uploadDir: uploadDir,
    acceptMimes: [ "application/json", "multipart/form-data" ],
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
        debug: (process.env.NODE_ENV === "development"),
        level: (process.env.NODE_ENV === "development") ? "debug" : "info",
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
            dropSchema: false,
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
    ],
    multer: {
        dest: uploadDir,                    // the destination directory for the uploaded files.
        storage: null,                      // the storage engine to use for uploaded files.
        // an object specifying the size limits of the following optional properties.
        // this object is passed to busboy directly, and the details of properties
        // can be found on https://github.com/mscdex/busboy#busboy-methods.
        limits: {
            fieldNameSize: 255              // max field name size (Default: 100 bytes).
            // fieldSize: 1,                   // max field value size (Default: 1MB).
            // fields: 0,                      // max number of non- file fields (Default: Infinity).
            // fileSize: 100,                  // for multipart forms, the max file size (in bytes)(Default: Infinity).
            // files: 5,                       // for multipart forms, the max number of file fields (Default: Infinity).
            // parts: 10,                      // for multipart forms, the max number of parts (fields + files)(Default: Infinity).
            // headerPairs: 10,                // for multipart forms, the max number of header key => value pairs to parse Default: 2000(same as node's http).
            // preservePath: true              // keep the full path of files instead of just the base name (Default: false).
        }
    }
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
            .use(bodyParser.urlencoded({ extended: true }))
            .use(bodyParser.raw());
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

    // public $beforeRoutesInits(): void {
    //     // add global middlewares
    //     this.use(middleware);
    // }

}

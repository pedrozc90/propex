import { Service, $log } from "@tsed/common";
import { BadRequest, Unauthorized, NotFound } from "@tsed/exceptions";
import { Secret, SignOptions, VerifyErrors, sign, verify } from "jsonwebtoken";

import { User, UserCredentials, UserBasic } from "../../../entities";
import { UserRepository, ProjectHumanResourceRepository } from "../../../repositories";
import { Scope, IJwt } from "../../types";
import { Context } from "../../models";

@Service()
export class AuthenticationService {

    constructor(private userRepository: UserRepository,
        private projectHumanResourceRepository: ProjectHumanResourceRepository) {}

    /**
     * Find user by credentials.
     * @param credentials           -- user credentials (email, password).
     */
    public async findByCredentials(credentials: UserCredentials): Promise<User | undefined> {
        return this.userRepository.findByCredentials(credentials);
    }

    /**
     * Load user context.
     * @param jwt                   -- decoded jwt token.
     */
    public async context(jwt?: IJwt): Promise<Context> {
        if (!jwt || !jwt.id) {
            throw new Unauthorized("Invalid token!");
        }

        // const user = await this.userRepository.createQueryBuilder("user")
        //     .leftJoinAndSelect("user.collaborator", "collaborator")
        //     .leftJoinAndSelect("user.student", "student")
        //     .where("user.id = :id", { id: jwt.id })
        //     .andWhere("user.active = :active", { active: 1 })
        //     .getOne();
        const user = await this.userRepository.findUserInfo({ id: jwt.id, active: true });
        if (!user) {
            throw new NotFound("User not found.");
        }

        const result = await this.projectHumanResourceRepository.createQueryBuilder("phr")
            .where("phr.user_id = :userId", { userId: 2 })
            .select("phr.project_id", "projectId")
            .getRawMany();

        const projectIds = result.map((r) => r.projectId);

        const context = new Context();
        context.user = user;
        context.scope = user.role || Scope.UNKNOWN; // this.defineScope(user);
        context.projectIds = projectIds;

        return context;
    }

    // private defineScope(user: User): Scope {
    //     if (user.id === 1) {
    //         return Scope.ADMIN;
    //     } else if (user.collaborator) {
    //         return Scope.COLLABORATOR;
    //     } else if (user.student) {
    //         return Scope.STUDENT;
    //     }
    //     return Scope.UNKNOWN;
    // }

    /**
     * Register a new user.
     * @param user                  -- user information.
     */
    public async register(user: UserBasic): Promise<User | null> {
        return this.userRepository.save(user);
    }

    /**
     * Sign a jwt token with user data.
     * @param user                  -- user data.
     */
    public async signJwtToken(user: User, rememberMe: boolean = false): Promise<string | null> {
        if (!process.env.JWT_SECRET_KEY) return null;

        const now: number = Math.floor(Date.now() / 1000);
        const payload: any = {
            id: user.id,
            email: user.email,
            iat: now
            // exp: now + JWT_EXPIRATION
        };
        const secret: Secret = process.env.JWT_SECRET_KEY;
        const options: SignOptions = {}; // algorithm: "RS256",

        if (!rememberMe) {
            options.expiresIn = process.env.JWT_SECRET_KEY || "24h";
        }

        return new Promise((resolve, reject) => {
            sign(payload, secret, options, (err: Error | null, token: string | undefined): void => {
                if (err) {
                    reject(err);
                } else {
                    $log.debug(`[Authentication] user: ${user.email}, token: ${token}`);
                    resolve(token);
                }
            });
        });
    }

    /**
     * Verify if jwt token is valid.
     * @param token                 -- jwt token taken from request headers
     */
    public async verifyJwtToken(token: string): Promise<any> {
        if (!process.env.JWT_SECRET_KEY) return;
        
        const secret: Secret = process.env.JWT_SECRET_KEY;

        return new Promise((resolve, reject) => {
            verify(this.getJwtToken(token), secret, (err: VerifyErrors | null, decoded: object | undefined): any => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    }

    /**
     * Parse jwt token from 'Authorization' request header.
     * @param token                 -- jwt token
     */
    public getJwtToken(token: string): string {
        const words: string[] = token.split(" ");
        if (words[0] !== "Bearer") {
            throw new BadRequest("Token do not start with 'Bearer'");
        }
        return words[1];
    }

    /**
     * Set token to 'Authorization' request header.
     * @param token                 -- jwt Token
     */
    public setJwtToken(token: string): string {
        return `Bearer ${token}`;
    }

}

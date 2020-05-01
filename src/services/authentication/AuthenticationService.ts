import { Service } from "@tsed/common";
import { Secret, SignOptions, VerifyErrors, sign, verify } from "jsonwebtoken";
import { BadRequest } from "ts-httpexceptions";

import { User, UserCredentials, UserBasic } from "../../entities";
import { UserRepository, CollaboratorRepository, StudentRepository } from "../../repositories";
import { Scope, IContext } from "../../types";

const JWT_SECRET_KEY: string | undefined = process.env.JWT_SECRET_KEY;
const JWT_EXPIRATION: number = 1 * 60 * 60; // seconds

@Service()
export class AuthenticationService {

    constructor(private userRepository: UserRepository,
        private collaboratorRepository: CollaboratorRepository,
        private studentRepository: StudentRepository) {}

    /**
     * Find user by credentials.
     * @param credentials   -- user credentials.
     */
    public async findByCredentials(credentials: UserCredentials): Promise<User | undefined> {
        return this.userRepository.findByCredentials(credentials);
    }

    /**
     * Find user by credentials.
     * @param credentials   -- user credentials.
     */
    public async context(id: number): Promise<IContext> {
        const context: IContext = {};
        context.user = await this.userRepository.findById(id);
        context.collaborator = await this.collaboratorRepository.createQueryBuilder("c")
            .innerJoin("c.user", "users", "c.user_id = :userId", { userId: context?.user?.id })
            .getOne();
        context.student = await this.studentRepository.createQueryBuilder("s")
            .innerJoin("s.user", "users", "s.user_id = :userId", { userId: context?.user?.id })
            .getOne();
        
        if (context.user && context.user.id === 1) {
            context.scope = Scope.ADMINISTRATOR;
        }

        if (context.collaborator) {
            context.scope = Scope.COLLABORATOR;
        }

        if (context.student) {
            context.scope = Scope.STUDENT;
        }

        return context;
    }

    /**
     * Register a new user.
     * @param user      -- user information.
     */
    public async register(user: UserBasic): Promise<User | null> {
        return this.userRepository.save(user);
    }

    /**
     * Sign Jwt token with user data.
     * @param user      -- user data.
     */
    public async signJwtToken(user: User, rememberMe: boolean = false): Promise<string | null> {
        if (!JWT_SECRET_KEY) return null;

        const now: number = Math.floor(Date.now() / 1000);
        const payload: any = {
            id: user.id,
            iat: now
            // exp: now + JWT_EXPIRATION
        };
        const secret: Secret = JWT_SECRET_KEY;
        const options: SignOptions = {};
        // algorithm: "RS256",
        // expiresIn: JWT_EXPIRATION || "1h"
        if (!rememberMe) {
            options.expiresIn = JWT_EXPIRATION || "24h";
        }
        return new Promise((resolve, reject) => {
            sign(payload, secret, options, (err: Error | null, token: string | undefined): void => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    }

    /**
     * Verify if jwt token is valid.
     * @param token
     */
    public async verifyJwtToken(token: string): Promise<any> {
        if (!JWT_SECRET_KEY) return;
        return new Promise((resolve, reject) => {
            verify(this.getJwtToken(token), JWT_SECRET_KEY, (err: VerifyErrors | null, decoded: object | undefined): any => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    }

    /**
     * Retrieve token from 'Authorization' request header.
     * @param token -- Jwt Token
     */
    public getJwtToken(token: string): string {
        const words: string[] = token.split(" ");
        if (words[0] !== "Bearer") {
            throw new BadRequest("Token do not start with 'Bearer'");
        }
        return words[1];
        // return token.substring(("Bearer").length).trim();
    }

    /**
     * Set token to 'Authorization' request header.
     * @param token -- Jwt Token
     */
    public setJwtToken(token: string): string {
        return `Bearer ${token}`;
    }

}

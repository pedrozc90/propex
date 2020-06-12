import { Service, $log } from "@tsed/common";
import { BadRequest, Unauthorized } from "@tsed/exceptions";
import { Secret, SignOptions, VerifyErrors, sign, verify } from "jsonwebtoken";

import { User, UserCredentials, UserBasic, Collaborator, Student } from "../../entities";
import { UserRepository, CollaboratorRepository, StudentRepository } from "../../repositories";
import { Scope, IContext, IJwt } from "../../types";

@Service()
export class AuthenticationService {

    constructor(private userRepository: UserRepository,
        private collaboratorRepository: CollaboratorRepository,
        private studentRepository: StudentRepository) {}

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
    public async context(jwt?: IJwt): Promise<IContext> {
        if (!jwt || !jwt.id) {
            throw new Unauthorized("Invalid token!");
        }

        const user = await this.userRepository.findOne({ id: jwt.id, active: true })
            .catch((error: any) => {
                $log.error(error.message);
            });
        if (!user) {
            throw new Unauthorized("User is inative!");
        }

        const collaborator = await this.collaboratorRepository.createQueryBuilder("collaborator")
            .innerJoin("collaborator.user", "user", "collaborator.user_id = :userId", { userId: user?.id })
            .getOne();

        const student = await this.studentRepository.createQueryBuilder("student")
            .innerJoin("student.user", "user", "student.user_id = :userId", { userId: user?.id })
            .getOne();

        const scope = this.defineScope(user, collaborator, student);
        
        return { user, collaborator, student, scope };
    }

    private defineScope(user?: User, collaborator?: Collaborator, student?: Student): Scope {
        if (user) {
            if (user.id === 1) {
                return Scope.ADMIN;
            } else if (collaborator) {
                return Scope.COLLABORATOR;
            } else if (student) {
                return Scope.STUDENT;
            }
        }
        return Scope.UNKNOWN;
    }

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

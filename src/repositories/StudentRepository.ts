import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Student } from "../entities";

@EntityRepository(Student)
export class StudentRepository extends GenericRepository<Student> {

}

import { User } from "./entities/User";
import bcryptjs from "bcryptjs";
import { isEmailValid } from "./validators/EmailValidator"
import { isPasswordValid } from "./validators/PasswordValidator"

const saltRounds = 10;

export class UserResult {
  constructor(public message?: Array<string>, public user?: User) {}
}






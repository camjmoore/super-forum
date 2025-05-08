import { User } from "./entities/User";
import bcryptjs from "bcryptjs";
import { isEmailValid } from "./validators/EmailValidator"
import { isPasswordValid } from "./validators/PasswordValidator"

const saltRounds = 10;

export class UserResult {
  constructor(public messages?: Array<string>, public user?: User) {}
}

export const register = async (
  email: string,
  userName: string,
  password: string
): Promise<UserResult> => {
  const result = isPasswordValid(password);
  if (!result.isValid) {
    return {
      messages: [
        "passwords must have min length of 8, 1 upper case character, 1 number and 1 symbol",
      ],
    };
  }

  const trimmedEmail = email.trim().toLowerCase();
  const emailError = isEmailValid(trimmedEmail);
  if (emailError) {
    return {
      messages: [emailError],
    };
  }

}




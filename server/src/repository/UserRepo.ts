import { User } from "./entities/User";
import bcrypt from "bcryptjs";
import { isEmailValid } from "./validators/EmailValidator";
import { isPasswordValid } from "./validators/PasswordValidator";

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

  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);

  const userEntity = await User.create({
    email: trimmedEmail,
    userName: userName,
    password: hashedPassword,
  }).save();

  userEntity.password = "";

  return {
    user: userEntity,
  };
};

export const login = async (
  userName: string,
  password: string
): Promise<UserResult> => {
  const user = await User.findOne({ where: { userName } });

  if (!user) {
    return {
      messages: [`User with username ${userName} not found`],
    };
  }

  if (!user.confirmed) {
    return {
      messages: ["User has not confirmed their registration email yet."],
    };
  }

  const passwordMatch = await bcrypt.compare(password, user?.password);

  if (!passwordMatch) {
    return {
      messages: ["Password is invalid."],
    };
  }

  return {
    user: user,
  };
};

export const logout = async (userName: string): Promise<Array<string>> => {
  const user = User.findOne({
    where: { userName },
  });

  if (!user) {
    return [`User with userName ${userName} could not be found.`];
  }

  return ["User logged out."];
};

export const getUserById = async (id: string): Promise<UserResult> => {
  const user = await User.findOne({ where: { id } });

  if (!user) {
    return {
      messages: [`User with id ${id} not found`],
    };
  }

  user.password = "";

  return {
    user: user,
  };
};

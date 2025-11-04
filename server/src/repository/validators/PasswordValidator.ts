export interface PasswordTestResult {
  message: string;
  isValid: boolean;
}

export const isPasswordValid = (password: string) => {
  const passwordTestResult: PasswordTestResult = {
    message: '',
    isValid: true,
  };

  if (password.length < 8) {
    passwordTestResult.message = 'Password must be atleast 8 characters long';
    passwordTestResult.isValid = false;
    return passwordTestResult;
  }

  const strongPasswordRegExp = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
  );

  if (!strongPasswordRegExp.test(password)) {
    passwordTestResult.message =
      'Password must contain atleast 1 special character, 1 capital letter and 1 number';
    passwordTestResult.isValid = false;
  }

  return passwordTestResult;
};

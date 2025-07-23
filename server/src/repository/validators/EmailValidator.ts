export const isEmailValid = (email: string) => {
  if (!email.includes('@')) return 'Please enter a valid email address';
  if (/\s+/g.test(email)) return 'Email cannot have whitespaces';
  return '';
};

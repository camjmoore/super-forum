import { isEmailValid } from '../../../repository/validators/EmailValidator';

describe('EmailValidator', () => {
  describe('isEmailValid', () => {
    it('should return an empty string for a valid email', () => {
      expect(isEmailValid('user@example.com')).toBe('');
      expect(isEmailValid('test.user+tag@example.co.uk')).toBe('');
    });

    it('should reject email without @ symbol', () => {
      expect(isEmailValid('testuser.com')).toBe(
        'Please enter a valid email address'
      );
    });

    it('should reject email with whitespace', () => {
      expect(isEmailValid('user @example.com')).toBe(
        'Email cannot have whitespaces'
      );
      expect(isEmailValid('user@ex ample.com')).toBe(
        'Email cannot have whitespaces'
      );
    });
  });
});

import { isPasswordValid } from '../../../repository/validators/PasswordValidator';

describe('PasswordValidator', () => {
  describe('isPasswordValid', () => {
    it('should accept valid strong password', () => {
      const result = isPasswordValid('Braveandtrue123!');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });

    it('should reject password shorter than 8 characters', () => {
      const result = isPasswordValid('Val1!');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Password must be atleast 8 characters long');
    });

    it('should reject password without uppercase letter', () => {
      const result = isPasswordValid('valid123!');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('1 capital letter');
    });

    it('should reject password without lowercase letter', () => {
      const result = isPasswordValid('VALID123!');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('1 capital letter');
    });

    it('should reject password without number', () => {
      const result = isPasswordValid('ValidPass!');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('1 number');
    });

    it('should reject password without special character', () => {
      const result = isPasswordValid('ValidPass123');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('1 special character');
    });
  });
});

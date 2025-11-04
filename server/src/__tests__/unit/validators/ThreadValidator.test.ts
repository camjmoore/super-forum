import {
  isThreadTitleValid,
  isThreadBodyValid,
} from '../../../repository/validators/ThreadValidator';

describe('ThreadValidator', () => {
  describe('isThreadTitleValid', () => {
    it('should accept valid title', () => {
      expect(isThreadTitleValid('Valid Title')).toBe('');
    });

    it('should reject empty title', () => {
      expect(isThreadTitleValid('')).toBe('Title cannot be empty.');
    });

    it('should reject title shorter than 5 characters', () => {
      expect(isThreadTitleValid('Hi')).toBe(
        'Title must be at least 5 characters.'
      );
    });

    it('should reject title longer than 150 characters', () => {
      const longTitle = 'a'.repeat(151);
      expect(isThreadTitleValid(longTitle)).toBe(
        'Title cannot be greater than 150 characters.'
      );
    });

    it('should accept title at boundary lengths', () => {
      expect(isThreadTitleValid('a'.repeat(5))).toBe('');
      expect(isThreadTitleValid('a'.repeat(150))).toBe('');
    });
  });

  describe('isThreadBodyValid', () => {
    it('should accept valid body', () => {
      expect(isThreadBodyValid('This is a valid thread body')).toBe('');
    });

    it('should reject empty body', () => {
      expect(isThreadBodyValid('')).toBe('Body cannot be empty.');
    });

    it('should reject body shorter than 10 characters', () => {
      expect(isThreadBodyValid('Short')).toBe(
        'Body must be at least 10 characters.'
      );
    });

    it('should reject body longer than 2500 characters', () => {
      const longBody = 'a'.repeat(2501);
      expect(isThreadBodyValid(longBody)).toBe(
        'Body cannot be greater than 2500 characters.'
      );
    });

    it('should accept body at boundary lengths', () => {
      expect(isThreadBodyValid('a'.repeat(10))).toBe('');
      expect(isThreadBodyValid('a'.repeat(2500))).toBe('');
    });
  });
});

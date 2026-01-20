// Test validation functions from content.js
function validateScrollThreshold(value) {
  const num = parseInt(value);
  return isNaN(num) ? 10 : Math.max(1, Math.min(100, num));
}

function validateTimeWindow(value) {
  const num = parseInt(value);
  return isNaN(num) ? 30 : Math.max(5, Math.min(300, num));
}

describe('Content Script Tests', () => {
  describe('validateScrollThreshold', () => {
    test('returns default value for invalid input', () => {
      expect(validateScrollThreshold('invalid')).toBe(10);
      expect(validateScrollThreshold(null)).toBe(10);
      expect(validateScrollThreshold(undefined)).toBe(10);
    });

    test('clamps values within range', () => {
      expect(validateScrollThreshold(0)).toBe(1);
      expect(validateScrollThreshold(50)).toBe(50);
      expect(validateScrollThreshold(150)).toBe(100);
    });

    test('handles string numbers', () => {
      expect(validateScrollThreshold('25')).toBe(25);
    });
  });

  describe('validateTimeWindow', () => {
    test('returns default value for invalid input', () => {
      expect(validateTimeWindow('invalid')).toBe(30);
      expect(validateTimeWindow(null)).toBe(30);
    });

    test('clamps values within range', () => {
      expect(validateTimeWindow(3)).toBe(5);
      expect(validateTimeWindow(60)).toBe(60);
      expect(validateTimeWindow(400)).toBe(300);
    });
  });
});

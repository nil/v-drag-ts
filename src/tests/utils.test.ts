import { defaultOptions, deepMerge } from '../index';

describe('Utils', () => {
  describe('deepMerge', () => {
    test('Replace value, superficial level', () => {
      const object = deepMerge(defaultOptions, { axis: 'x' });
      expect(object.axis).toBe('x');
    });
    test('Replace value, deep level', () => {
      const object = deepMerge(defaultOptions, { classEvent: { move: 'move' } });
      expect(object.classEvent.move).toBe('move');
    });
    test('Error if key does not exist, superficial level', () => {
      expect(() => deepMerge(defaultOptions, { test: true })).toThrow('"test" is not a valid option');
    });
    test('Error if key does not exist, superficial level', () => {
      expect(() => deepMerge(defaultOptions, { test: true })).toThrow('"test" is not a valid option');
    });
  });
});

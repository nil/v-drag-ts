import { defaultOptions, deepMerge, objectDeepKeys } from '../index';

describe('Utils', () => {
  describe('objectDeepKeys', () => {
    test('One level', () => {
      expect(objectDeepKeys({ a: 1, b: 2 })).toEqual(['a', 'b']);
    });
    test('Two levels', () => {
      expect(objectDeepKeys({ a: 1, b: { c: 2 } })).toEqual(['a', 'b', 'c']);
    });
    test('Emtpy object', () => {
      expect(objectDeepKeys({})).toEqual([]);
    });
  });

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

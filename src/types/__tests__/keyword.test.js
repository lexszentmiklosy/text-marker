/* global jest, describe, it, expect */
import keyword from '../keyword';

global.console = { error: jest.fn() };

describe('keyword()', () => {
  it('returns an object', () => {
    let result = keyword('TEST', 'NAME');
    expect(typeof result).toBe('object');
  });

  it('accepts a regex as an arguement', () => {
    let dummyRegex = /hello/
    let result = keyword(dummyRegex, 'NAME');
    expect(result.pattern).toBe(dummyRegex);
  });

  it('it returns false if it cannot create a pattern', () => {
    let result = keyword(0, 'NAME');
    expect(result).toBe(false);
  });
});

describe('keyword().pattern', () => {
  it('exists', () => {
    let result = keyword('TEST', 'NAME');
    expect(result.pattern).toBeTruthy();
  });

  it('is a regex', () => {
    let result = keyword('TEST', 'NAME');
    expect(result.pattern instanceof RegExp).toBe(true);
  });

  it('has gi flags', () => {
    let result = keyword('TEST', 'NAME');
    expect(result.pattern.flags).toBe('gi');
  });
});


describe('keyword().onMatch', () => {
  it('exists', () => {
    let result = keyword('TEST', 'NAME');
    expect(result.onMatch).toBeTruthy();
  });

  it('is a function', () => {
    let result = keyword('TEST', 'NAME');
    expect(typeof result.onMatch).toBe('function');
  });

  it('returns an object', () => {
    let result = keyword('TEST', 'NAME');
    expect(typeof result.onMatch({ index: 0 })).toBe('object');
  });

  it('uses name provided', () => {
    let result = keyword('TEST', 'FOO').onMatch({ index: 0 });
    let name = result.name;
    expect(name).toBe('FOO');
  });

  it('has type \'KEYWORD\'', () => {
    let result = keyword('TEST', 'NAME').onMatch({ index: 0 });
    expect(result.type).toBe('KEYWORD');
  });

  it('has chars string', () => {
    let result = keyword('TEST', 'NAME').onMatch({ index: 0 });
    expect(result.chars).toBe('TEST');
  });

  it('has an index', () => {
    let result = keyword('TEST', 'NAME').onMatch({ index: 5 });
    expect(result.index).toBe(5);
  });

  it('handle is  \'at\'', () => {
    let result = keyword('TEST', 'NAME').onMatch({ index: 0 });
    expect(result.handle).toBe('at');
  });
});

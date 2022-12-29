import libTemplate from '../lib/index';

describe('lib-template index', () => {
  it('default export should an object', () => {
    expect(typeof libTemplate).toEqual('object');
    expect(libTemplate).toEqual({});
  });
});

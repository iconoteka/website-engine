import isPredicate from './isPredicate';

describe('isPredicate', () => {

  const object = {
    isBold: false,
    isFill: true,
  };

  it('Returns true if property exists and equals true', () => {
    expect(isPredicate(object, 'fill')).toEqual(true);
  });

  it('Doesnt break on unknown property', () => {
    expect(isPredicate(object, 'someprop')).toEqual(false);
  });

  it('Returns false if property is falsy', () => {
    expect(isPredicate(object, 'bold')).toEqual(false);
  });

});

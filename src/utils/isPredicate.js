import capitalize from './capitalize';

export default function isPredicate(object, propertyName) {
  return object[`is${capitalize(propertyName)}`] === true;
}

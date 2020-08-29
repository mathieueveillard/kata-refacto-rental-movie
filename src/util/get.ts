export function get<T>(attributeName: string) {
  return function (object: Object): T {
    return object[attributeName];
  };
}

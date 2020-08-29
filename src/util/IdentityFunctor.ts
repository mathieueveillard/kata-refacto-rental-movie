export function IdentityFunctor<S>(value: S) {
  return {
    value,
    map: <U>(fn: (s: S) => U) => IdentityFunctor(fn(value)),
    valueOf: () => value,
  };
}

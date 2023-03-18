type t<T> = Promise<T>;

let all3 = <T0, T1, T2>(
  p0: t<T0>,
  p1: t<T1>,
  p2: t<T2>
): t<[T0, T1, T2]> => Promise.all([p0, p1, p2]);

let map = <T, U>(f: (x: T) => U, x: t<T>): t<U> =>
  x.then((y) => f(y));

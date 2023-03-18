// let then_ = <T, U>(f: (x: T) => U | null, x: T | null): U | null => {
//   return x ? f(x) : null;
// };

// let iter = <T>(f: (x: T) => void, x: T | null): void => {
//   if (x) {
//     f(x);
//   }
// };

// let map = <T, U>(f: (x: T) => U, x: T | null): U | null => {
//   return x ? f(x) : null;
// };

// let get = <T>(orElse: T, x: T | null): T => {
//   return x ?? orElse;
// };

// let to_list = <T>(x: T | null): T[] => {
//   return x ? [x] : [];
// };

// let bind = <T, U>(x: T | null, f: (x: T) => U | null): U | null => then_(f, x);

// let operator_>>= = bind;

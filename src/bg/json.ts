export class Json {
  static decodeList<T>(coerce: (x: any) => T, xs: any): T[] {
    const array = Array.isArray(xs) ? xs : [];
    return array.map(coerce);
  }
}

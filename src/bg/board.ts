export class Board {
  static regexp = new RegExp("trello[.]com/b/([^/]+)");

  static parseUrl(url: string) {
    const result = this.regexp.exec(url);
    if (result) {
      const xs = result;
      if (xs.length >= 2) {
        return xs[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}

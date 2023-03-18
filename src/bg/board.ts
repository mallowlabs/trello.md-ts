export class Board {
  static regexp = new RegExp("trello[.]com/b/([^/]+)");

  static parse_url(url: string) {
    let result = this.regexp.exec(url);
    if (result) {
      let xs = result;
      if (xs.length >= 2) {
        return xs[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

}

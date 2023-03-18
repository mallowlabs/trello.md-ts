let regexp = new RegExp("trello[.]com/b/([^/]+)");

let parse_url = (url: string) => {
  let result = regexp.exec(url);
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

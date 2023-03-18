import { sprintf } from "sprintf-js";

let h1 = (buffer: Buffer, title: string): void => {
  buffer.addString("# " + title + "\n\n");
};
let h2 = (buffer: Buffer, title: string): void => {
  buffer.addString("## " + title + "\n\n");
};
let quote = (buffer: Buffer, text: string): void => {
  let s = text.replace(/\n/g, "\n> ");
  buffer.addString("> " + s + "\n\n");
};

let avatarUrl = (hash: string): string =>
  sprintf("https://trello-avatars.s3.amazonaws.com/%s/30.png", hash);

let avatar = (member: any): string => {
  let hash = member.avatarHash ?? null;
  return hash
    ? sprintf("![%s](%s)", member.username, avatarUrl(hash))
    : member.username;
};

let attachment = (obj: any): string => {
  let url = obj.url ?? "";
  return sprintf("![%s](%s)", obj.name, url);
};

let regexp = /_$/;

let accept = (name: string): boolean => {
  let except = regexp.test(name);
  return !except;
};

let format = (xs: any[]): string => {
  let buffer = Buffer.alloc(0);
  xs.forEach(({ list, cards }) => {
    if (accept(list.name)) {
      h1(buffer, list.name);
      cards.forEach(({ card, members, actions }) => {
        let card_members = members.map(avatar).join(" ");

        h2(
          buffer,
          sprintf("[:link:](%s) %s %s", card.url, card.name, card_members)
        );
        quote(buffer, card.desc);
        actions.forEach(([action, member]) => {
          quote(buffer, "----");
          if (member) {
            quote(buffer, sprintf("%s %s", avatar(member), action.date));
          }
          if (action.data.text) {
            quote(buffer, action.data.text);
          }
          if (action.data.attachment) {
            quote(buffer, attachment(action.data.attachment));
          }
        });
      });
    }
  });
  return buffer.toString();
};

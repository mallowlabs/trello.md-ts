import { CardActionType, CardType } from "./card";
import { MemberType } from "./member";

export class Markdown {

  static h1 = (buffer: Buffer, title: string): void => {
    buffer.write("# " + title + "\n\n");
  };
  static h2 = (buffer: Buffer, title: string): void => {
    buffer.write("## " + title + "\n\n");
  };
  static quote = (buffer: Buffer, text: string): void => {
    let s = text.replace(/\n/g, "\n> ");
    buffer.write("> " + s + "\n\n");
  };

  static avatarUrl = (hash: string): string =>
    `https://trello-avatars.s3.amazonaws.com/${hash}/30.png`;

  static avatar = (member: any): string => {
    let hash = member.avatarHash ?? null;
    return hash
      ? `![${member.username}](${this.avatarUrl(hash)})`
      : member.username;
  };

  static attachment = (obj: any): string => {
    let url = obj.url ?? "";
    return `![${obj.name}](${url})`;
  };

  static regexp = /_$/;

  static accept = (name: string): boolean => {
    let except = this.regexp.test(name);
    return !except;
  };

  static format = (xs: any[]): string => {
    let buffer = Buffer.alloc(0);
    xs.forEach(({ list, cards }) => {
      if (this.accept(list.name)) {
        this.h1(buffer, list.name);
        cards.forEach(({ card, members, actions }: { card: CardType, members: Array<MemberType>, actions: Array<CardActionType> }) => {
          let card_members = members.map(this.avatar).join(" ");

          this.h2(
            buffer,
            `[:link:](${card.url}) ${card.name} ${card_members}`
          );
          this.quote(buffer, card.desc);
          actions.forEach((action) => {
            const member = action.idMemberCreator; // FIXME
            this.quote(buffer, "----");
            if (member) {
              this.quote(buffer, `${this.avatar(member)} ${action.date}`);
            }
            if (action.data.text) {
              this.quote(buffer, action.data.text);
            }
            if (action.data.attachment) {
              this.quote(buffer, this.attachment(action.data.attachment));
            }
          });
        });
      }
    });
    return buffer.toString();
  };

}

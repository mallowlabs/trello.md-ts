import { ListDetailType } from "./listWithCard";
import { MemberType } from "./member";

export class Markdown {
  private static h1 = (buffer: Buffer, title: string): void => {
    buffer.write("# " + title + "\n\n");
  };
  private static h2 = (buffer: Buffer, title: string): void => {
    buffer.write("## " + title + "\n\n");
  };
  private static quote = (buffer: Buffer, text: string): void => {
    const s = text.replace(/\n/g, "\n> ");
    buffer.write("> " + s + "\n\n");
  };

  private static avatarUrl = (hash: string): string =>
    `https://trello-avatars.s3.amazonaws.com/${hash}/30.png`;

  private static avatar = (member: MemberType): string => {
    const hash = member.avatarHash ?? null;
    return hash
      ? `![${member.username}](${this.avatarUrl(hash)})`
      : member.username;
  };

  private static attachment = (obj: { url?: string; name: string }): string => {
    const url = obj.url ?? "";
    return `![${obj.name}](${url})`;
  };

  private static regexp = /_$/;

  private static accept = (name: string): boolean => {
    const except = this.regexp.test(name);
    return !except;
  };

  static format = (xs: ListDetailType[]): string => {
    const buffer = Buffer.alloc(0);
    xs.forEach(({ list, cards }) => {
      if (this.accept(list.name)) {
        this.h1(buffer, list.name);
        cards.forEach(({ card, members, actions }) => {
          const cardMembers = members.map(this.avatar).join(" ");

          this.h2(buffer, `[:link:](${card.url}) ${card.name} ${cardMembers}`);
          this.quote(buffer, card.desc);
          actions.forEach(([action, member]) => {
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

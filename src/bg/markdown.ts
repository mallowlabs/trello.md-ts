import { ListDetailType } from "./listWithCard";
import { MemberType } from "./member";

export class Markdown {
  private static h1 = (buffer: string, title: string): string => {
    return (buffer + "# " + title + "\n\n");
  };
  private static h2 = (buffer: string, title: string): string => {
    return (buffer + "## " + title + "\n\n");
  };
  private static quote = (buffer: string, text: string): string => {
    const s = text.replace(/\n/g, "\n> ");
    return (buffer + "> " + s + "\n\n");
  };

  private static avatarUrl = (id: string, hash: string): string =>
    `https://trello-members.s3.amazonaws.com/${id}/${hash}/30.png`;

  private static avatar = (member: MemberType): string => {
    const hash = member.avatarHash ?? null;
    return hash
      ? `![${member.username}](${this.avatarUrl(member.id, hash)})`
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
    let buffer = "";
    xs.forEach(({ list, cards }) => {
      if (this.accept(list.name)) {
        buffer = this.h1(buffer, list.name);
        cards.forEach(({ card, members, actions }) => {
          const cardMembers = members.map(this.avatar).join(" ");

          buffer = this.h2(
            buffer,
            `[:link:](${card.url}) ${card.name} ${cardMembers}`,
          );
          buffer = this.quote(buffer, card.desc);
          actions.forEach(([action, member]) => {
            buffer = this.quote(buffer, "----");
            if (member) {
              const dateString = new Date(action.date).toLocaleString();
              buffer = this.quote(
                buffer,
                `${this.avatar(member)} ${dateString}`,
              );
            }
            if (action.data.text) {
              buffer = this.quote(buffer, action.data.text);
            }
            if (action.data.attachment) {
              buffer = this.quote(
                buffer,
                this.attachment(action.data.attachment),
              );
            }
          });
        });
      }
    });
    return buffer;
  };
}

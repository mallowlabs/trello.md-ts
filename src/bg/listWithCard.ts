import type { CardType,CardActionType } from "./card";
import type { MemberType } from "./member";
import type { TrelloListType } from "./trelloList";

type s = {
  card: CardType;
  members: Array<MemberType>;
  actions: [CardActionType, MemberType | null][];
};
type t = {
  list: TrelloListType;
  cards: s[];
};

export class ListWithCard {

  static tablize = <T>(f: (x: T) => string, xs: T[]): Record<string, T> => {
    let tbl = {} as Record<string, T>;
    xs.forEach((x) => {
      tbl[f(x)] = x;
    });
    return tbl;
  };

  static filter_map = <T, U>(f: (x: T) => U | null, xs: T[]): U[] => {
    return xs.flatMap((x) => f(x) ?? []);
  };

  static find = <T>(tbl: Record<string, T>, x: string): T | null => {
    return tbl[x] ?? null;
  };
  static make_card = (
    card_table: Record<string, any>,
    member_table: Record<string, any>,
    card: CardType
  ): s => {
    let c = card_table[card.id];
    let members = card.idMembers
      .map((id) => this.find(member_table, id))
      .filter((x) => x !== null);
    let actions = c.actions.map((action: CardActionType) => [
      action,
      this.find(member_table, action.idMemberCreator)
    ]);
    return { card: c, members, actions };
  };

  static make_list = (
    card_table: Record<string, any>,
    member_table: Record<string, any>,
    list: any
  ): t => {
    let cards = list.cards.map((card: CardType) =>
    this.make_card(card_table, member_table, card)
    );
    return { list, cards };
  };

  static make = ({
    lists,
    cards,
    members
  }: {
    lists: any[];
    cards: any[];
    members: any[];
  }): t[] => {
    let card_table = this.tablize((x) => x.id, cards);
    let member_table = this.tablize((x) => x.id, members);
    return lists.map((list) => this.make_list(card_table, member_table, list));
  };

}

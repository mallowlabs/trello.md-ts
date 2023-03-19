import type { CardType, CardActionType } from "./card";
import type { MemberType } from "./member";
import type { TrelloListType } from "./trelloList";

export type CardDetailType = {
  card: CardType;
  members: Array<MemberType>;
  actions: Array<[CardActionType, MemberType | null]>;
};
export type ListDetailType = {
  list: TrelloListType;
  cards: CardDetailType[];
};

export class ListWithCard {
  static tablize = <T>(f: (x: T) => string, xs: T[]): Record<string, T> => {
    const tbl = {} as Record<string, T>;
    xs.forEach((x) => {
      tbl[f(x)] = x;
    });
    return tbl;
  };

  static filterMap = <T, U>(f: (x: T) => U | null, xs: T[]): U[] => {
    return xs.flatMap((x) => f(x) ?? []);
  };

  static find = <T>(tbl: Record<string, T>, x: string): T | null => {
    return tbl[x] ?? null;
  };

  static tuplize(
    action: CardActionType,
    member: MemberType | null
  ): [CardActionType, MemberType | null] {
    return [action, member];
  }

  static makeCard = (
    card_table: Record<string, CardType>,
    member_table: Record<string, MemberType>,
    card: CardType
  ): CardDetailType => {
    const c = card_table[card.id];
    const members = card.idMembers
      .map((id) => this.find(member_table, id))
      .filter((item): item is NonNullable<typeof item> => item != null);
    const actions = c.actions.map((action) =>
      this.tuplize(action, this.find(member_table, action.idMemberCreator))
    );
    return { card: c, members, actions };
  };

  static makeList = (
    card_table: Record<string, CardType>,
    member_table: Record<string, MemberType>,
    list: TrelloListType
  ): { list: TrelloListType; cards: Array<CardDetailType> } => {
    const cards = list.cards.map((card) =>
      this.makeCard(card_table, member_table, card)
    );
    return { list, cards };
  };

  static make = ({
    lists,
    cards,
    members,
  }: {
    lists: TrelloListType[];
    cards: CardType[];
    members: MemberType[];
  }): ListDetailType[] => {
    const card_table = this.tablize((x) => x.id, cards);
    const member_table = this.tablize((x) => x.id, members);
    return lists.map((list) => this.makeList(card_table, member_table, list));
  };
}

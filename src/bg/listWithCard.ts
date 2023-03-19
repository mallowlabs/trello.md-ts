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
  private static tablize = <T>(
    f: (x: T) => string,
    xs: T[]
  ): Record<string, T> => {
    const tbl = {} as Record<string, T>;
    xs.forEach((x) => {
      tbl[f(x)] = x;
    });
    return tbl;
  };

  private static find = <T>(tbl: Record<string, T>, x: string): T | null => {
    return tbl[x] ?? null;
  };

  private static tuplize(
    action: CardActionType,
    member: MemberType | null
  ): [CardActionType, MemberType | null] {
    return [action, member];
  }

  private static makeCard = (
    cardTable: Record<string, CardType>,
    memberTable: Record<string, MemberType>,
    card: CardType
  ): CardDetailType => {
    const c = cardTable[card.id];
    const members = card.idMembers
      .map((id) => this.find(memberTable, id))
      .filter((item): item is NonNullable<typeof item> => item != null);
    const actions = c.actions.map((action) =>
      this.tuplize(action, this.find(memberTable, action.idMemberCreator))
    );
    return { card: c, members, actions };
  };

  private static makeList = (
    cardTable: Record<string, CardType>,
    memberTable: Record<string, MemberType>,
    list: TrelloListType
  ): { list: TrelloListType; cards: Array<CardDetailType> } => {
    const cards = list.cards.map((card) =>
      this.makeCard(cardTable, memberTable, card)
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
    const cardTable = this.tablize((x) => x.id, cards);
    const memberTable = this.tablize((x) => x.id, members);
    return lists.map((list) => this.makeList(cardTable, memberTable, list));
  };
}

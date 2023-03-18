type s = {
  card: Card.t;
  members: Member.t[];
  actions: [Card.action, Member.t | null][];
};
type t = {
  list: TrelloList.t;
  cards: s[];
};

let tablize = <T>(f: (x: T) => string, xs: T[]): Record<string, T> => {
  let tbl = {} as Record<string, T>;
  xs.forEach((x) => {
    tbl[f(x)] = x;
  });
  return tbl;
};

let filter_map = <T, U>(f: (x: T) => U | null, xs: T[]): U[] => {
  return xs.flatMap((x) => f(x) ?? []);
};

let find = <T>(tbl: Record<string, T>, x: string): T | null => {
  return tbl[x] ?? null;
};
let make_card = (
  card_table: Record<string, any>,
  member_table: Record<string, any>,
  card: any
): s => {
  let c = card_table[card.id];
  let members = card.idMembers
    .map((id) => find(member_table, id))
    .filter((x) => x !== null);
  let actions = c.actions.map((action) => [
    action,
    find(member_table, action.idMemberCreator)
  ]);
  return { card: c, members, actions };
};

let make_list = (
  card_table: Record<string, any>,
  member_table: Record<string, any>,
  list: any
): t => {
  let cards = list.cards.map((card) =>
    make_card(card_table, member_table, card)
  );
  return { list, cards };
};

let make = ({
  lists,
  cards,
  members
}: {
  lists: any[];
  cards: any[];
  members: any[];
}): t[] => {
  let card_table = tablize((x) => x.id, cards);
  let member_table = tablize((x) => x.id, members);
  return lists.map((list) => make_list(card_table, member_table, list));
};

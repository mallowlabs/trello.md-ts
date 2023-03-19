import Trello from "trello-web";
import { CardType } from "./card";

export type TrelloListType = {
  name: string;
  cards: Array<CardType>;
};

export class TrelloList {
  static fetch = (client: Trello, id: string): Promise<TrelloListType[]> => {
    const url = `/1/boards/${id}/lists`;
    return client
      .get(url, { cards: "open" })
      .then((response: any) => response as Array<TrelloListType>);
  };
}

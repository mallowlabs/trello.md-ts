import Trello from "trello-web";
import { CardType } from "./card";
import { Json } from "./json";

export type TrelloListType = {
  name: string;
  cards: Array<CardType>;
};

export class TrelloList {
  static coerce = (json: any): TrelloListType => json as TrelloListType;

  static fetch = (client: Trello, id: string): Promise<TrelloListType[]> => {
    const url = `/1/boards/${id}/lists?cards=open`;
    return client
      .get(url)
      .then((response: any) => Json.decodeList(this.coerce, response));
  };
}

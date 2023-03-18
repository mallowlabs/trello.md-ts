import { Trello } from "trello-web";
import { Json } from "./json";

export type TrelloListType = {
  name: string;
  cards: { id: string; idMembers: string[] }[];
};

export class TrelloList {

  static coerce = (json: any): TrelloListType => json as TrelloListType;

  static fetch = (client: any, id: string): Promise<TrelloListType[]> => {
    let url = `/1/boards/${id}/lists?cards=open`;
    return Trello.get(client, url).then((response: any) =>
      Json.decodeList(this.coerce, response)
    );
  };

}

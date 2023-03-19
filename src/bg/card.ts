import { Trello } from "trello-web";
import { Json } from "./json";

export type CardActionType = {
  idMemberCreator: string;
  date: string;
  data: {
    text?: string;
    attachment?: {
      name: string;
      url?: string;
    };
  };
};

export type CardType = {
  id: string;
  name: string;
  desc: string;
  url: string;
  idMembers: Array<string>;
  actions: Array<CardActionType>;
};

export class Card {
  static coerce = (json: any): CardType => json;

  static fetch = (client: Trello, id: string) => {
    let url = `/1/boards/${id}/cards?actions=commentCard,addAttachmentToCard`;
    return client.get(url).then((response: any) =>
      Json.decodeList(this.coerce, response)
    );
  };
}


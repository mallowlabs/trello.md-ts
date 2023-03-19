import Trello from "trello-web";

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
  static fetch = (client: Trello, id: string) => {
    const url = `/1/boards/${id}/cards`;
    return client
      .get(url, { actions: "commentCard,addAttachmentToCard" })
      .then((response: any) => response as Array<CardType>);
  };
}

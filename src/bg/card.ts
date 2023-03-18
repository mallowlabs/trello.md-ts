type action = {
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

type t = {
  id: string;
  name: string;
  desc: string;
  url: string;
  idMembers: Array<string>;
  actions: Array<action>;
};

let coerce = (json: any): t => json;

let fetch = (client: any, id: string) => {
  let url = `/1/boards/${id}/cards?actions=commentCard,addAttachmentToCard`;
  return Trello.get(client, url).then((response) =>
    Json.decodeList(coerce, response)
  );
};

type t = {
  name: string;
  cards: { id: string; idMembers: string[] }[];
};

let coerce = (json: any): t => json as t;

let fetch = (client: any, id: string): Promise<t[]> => {
  let url = sprintf("/1/boards/%s/lists?cards=open", id);
  return Trello.get(client, url).then((response) =>
    Json.decodeList(coerce, response)
  );
};

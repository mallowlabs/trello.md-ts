type t = {
  id: string;
  avatarHash: string | null;
  username: string;
};

let coerce = (json: any): t => json as t;

let fetch = (client: any, id: string): Promise<t[]> => {
  let url = sprintf("/1/boards/%s/members?fields=all", id);
  return Trello.get(client, url).then((response) =>
    Json.decodeList(coerce, response)
  );
};

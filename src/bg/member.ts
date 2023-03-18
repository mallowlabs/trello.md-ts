import { Trello } from "trello-web";
import { Json } from "./json";

export type MemberType = {
  id: string;
  avatarHash: string | null;
  username: string;
};

export class Member {
  static coerce = (json: any): MemberType => json as MemberType;

  static fetch = (client: any, id: string): Promise<MemberType[]> => {
    let url = `/1/boards/${id}/members?fields=all`;
    return Trello.get(client, url).then((response: any) =>
      Json.decodeList(this.coerce, response)
    );
  };

}


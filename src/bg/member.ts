import Trello from "trello-web";

export type MemberType = {
  id: string;
  avatarHash: string | null;
  username: string;
};

export class Member {
  static fetch = (client: Trello, id: string): Promise<MemberType[]> => {
    const url = `/1/boards/${id}/members`;
    return client
      .get(url, { fields: "all" })
      .then((response: any) => response as Array<MemberType>);
  };
}

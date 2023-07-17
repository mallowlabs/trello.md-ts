declare module "trello-web" {
  type AuthOptionType = {
    name: string | null;
    expiration: string | null;
    scope: {
      read: boolean;
      write: boolean;
      account: boolean;
    } | null;
  };

  type DataType = {
    key: string;
    token: string;
    [name: string]: any;
  };
  class Trello {
    key: string;
    token?: string;
    constructor(key: string, token?: string);
    auth: (opts: AuthOptionType) => Promise<any>;
    req: (
      method: string,
      path: string,
      data?: Partial<DataType>,
    ) => Promise<any>;
    get: (path: string, data?: Partial<DataType>) => Promise<any>;
    head: (path: string, data?: Partial<DataType>) => Promise<any>;
    post: (path: string, data?: Partial<DataType>) => Promise<any>;
    put: (path: string, data?: Partial<DataType>) => Promise<any>;
  }
  export default Trello;
}

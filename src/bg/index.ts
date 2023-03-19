import Trello from "trello-web";
import { Board } from "./board";
import { Card } from "./card";
import { Clipboard } from "./clipboard";
import { ListDetailType, ListWithCard } from "./listWithCard";
import { Markdown } from "./markdown";
import { Member } from "./member";
import { TrelloList } from "./trelloList";

const domain = new RegExp("trello[.]com/b/");
const app_key = "d79e101f262c8b20de7993cdc98cd5b2";

const showIfTrello = (
  tab_id: number,
  _: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
) => {
  const url = tab.url;
  if (url && domain.test(url)) {
    chrome.pageAction.show(tab_id);
  }
};

const createTrello = (): Promise<Trello> => {
  return chrome.storage.local.get(["token"]).then((result) => {
    const token = result.value;
    if (token) {
      const client = new Trello(app_key, token);
      return Promise.resolve(client);
    } else {
      const client = new Trello(app_key);
      return client
        .auth({
          name: "Trello.md",
          expiration: "never",
          scope: { read: true, write: false, account: false },
        })
        .then(() => {
          return chrome.storage.local.set({ token: client.token || "" });
        })
        .then(() => {
          return Promise.resolve(client);
        });
    }
  });
};

const copyToClipboard = async (tab: chrome.tabs.Tab) => {
  chrome.action.setIcon({
    tabId: tab.id || 0,
    path: "../icons/executing.png",
  });

  createTrello()
    .then((client) => {
      const url = tab.url;
      if (url) {
        const id = Board.parseUrl(url);
        if (id) {
          return Promise.all<Array<any>>([
            TrelloList.fetch(client, id),
            Card.fetch(client, id),
            Member.fetch(client, id),
          ]);
        }
      }
      return Promise.resolve([[], [], []]);
    })
    .then(([lists, cards, members]) => {
      return Promise.resolve(ListWithCard.make({ lists, cards, members }));
    })
    .then((x: Array<ListDetailType>) => Promise.resolve(Markdown.format(x)))
    .then((s: string) => Clipboard.write(document, s))
    .then(() => {
      chrome.pageAction.setIcon({
        tabId: tab.id || 0,
        path: "../icons/icon19.png",
      });
    })
    .catch(console.error);
};

chrome.tabs.onUpdated.addListener(showIfTrello);
chrome.action.onClicked.addListener(copyToClipboard);

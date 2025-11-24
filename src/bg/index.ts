import Trello from "trello-web";
import { trelloAppKey } from "../appkey";
import { Board } from "./board";
import { Card } from "./card";
import { Clipboard } from "./clipboard";
import { ListDetailType, ListWithCard } from "./listWithCard";
import { Markdown } from "./markdown";
import { Member } from "./member";
import { TrelloList } from "./trelloList";

const createTrello = (): Promise<Trello> => {
  return chrome.storage.local.get(["token"]).then((result) => {
    const token = typeof result.token === "string" ? result.token : undefined;
    if (token) {
      const client = new Trello(trelloAppKey, token);
      return Promise.resolve(client);
    } else {
      chrome.runtime.openOptionsPage();
      return Promise.reject("Token required");
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
    .then((s: string) => Clipboard.write(tab.id || 0, s))
    .catch(console.error)
    .finally(() => {
      chrome.action.setIcon({
        tabId: tab.id || 0,
        path: "../icons/icon19.png",
      });
    });
};

chrome.action.onClicked.addListener(copyToClipboard);

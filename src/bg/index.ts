import Trello from "trello-web";
import { Board } from "./board";
import { Card } from "./card";
import { Clipboard } from "./clipboard";
import { ListDetailType, ListWithCard } from "./listWithCard";
import { Markdown } from "./markdown";
import { Member } from "./member";
import { TrelloList } from "./trelloList";

let domain = new RegExp("trello[.]com/b/");
let app_key = "d79e101f262c8b20de7993cdc98cd5b2";

let show_if_trello = (tab_id: number, _: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
  let url = tab.url;
  if (url && domain.test(url)) {
    chrome.pageAction.show(tab_id);
  }
};

let create_trello = () => {
  let token = localStorage.getItem("token");
  if (token) {
    let client = new Trello(app_key, token);
    return Promise.resolve(client);
  } else {
    const client = new Trello(app_key);
    return client.auth({
      name: "Trello.md",
      expiration: "never",
      scope: { read: true, write: false, account: false }
    }).then(() => {
      localStorage.setItem("token", client.token || "");
      return Promise.resolve(client);
    });
  }
};

let copy_to_clipboard = async (tab: chrome.tabs.Tab) => {
  chrome.pageAction.setIcon({
    tabId: tab.id || 0,
    path: "../icons/executing.png"
  });

  create_trello()
    .then((client) => {
      let url = tab.url;
      if (url) {
        let id = Board.parse_url(url);
        if (id) {
          return Promise.all<Array<any>>([
            TrelloList.fetch(client, id),
            Card.fetch(client, id),
            Member.fetch(client, id)
          ]);
        }
      }
      return Promise.resolve([ [], [], [] ]);
    })
    .then(([ lists, cards, members ]) => {
      return Promise.resolve(ListWithCard.make({ lists, cards, members }));
    })
    .then((x: Array<ListDetailType>) => Promise.resolve(Markdown.format(x)))
    .then((s: string) => Clipboard.write(document, s))
    .then(() => {
      chrome.pageAction.setIcon({
        tabId: tab.id || 0,
        path: "../icons/icon19.png"
      });
    })
    .catch(console.error);
};

chrome.tabs.onUpdated.addListener(show_if_trello);
chrome.pageAction.onClicked.addListener(copy_to_clipboard);

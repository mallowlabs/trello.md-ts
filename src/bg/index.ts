import { Trello } from "trello-web";
import { Board } from "./board";
import { TrelloList } from "./trelloList";
import { Card } from "./card";
import { Member } from "./member";
import { ListWithCard } from "./listWithCard";
import { Markdown } from "./markdown";
import { Clipboard } from "./clipboard";

let domain = new RegExp("trello[.]com/b/");
let app_key = "d79e101f262c8b20de7993cdc98cd5b2";

let show_if_trello = (tab_id: number, _: any, tab: chrome.tabs.Tab) => {
  let url = tab.url;
  if (url && domain.test(url)) {
    chrome.pageAction.show(tab_id);
  }
};

let create_trello = () => {
  let t = Trello.create(app_key);
  let token = localStorage.getItem("token");
  if (token) {
    Trello.set_token(t, token);
    return Promise.resolve(t);
  } else {
    return Trello.auth(t, {
      name: "Trello.md",
      expiration: "never",
      scope: { read: true, write: false, account: false }
    }).then(() => {
      localStorage.setItem("token", Trello.token(t));
      return Promise.resolve(t);
    });
  }
};

let copy_to_clipboard = (tab: chrome.tabs.Tab) => {
  chrome.pageAction.setIcon({
    tabId: tab.id || 0,
    path: "../icons/executing.png"
  });
  create_trello()
    .then((client: any) => {
      let url = tab.url;
      if (url) {
        let id = Board.parse_url(url);
        if (id) {
          return Promise.all([
            TrelloList.fetch(client, id),
            Card.fetch(client, id),
            Member.fetch(client, id)
          ]);
        }
      }
      return Promise.resolve([[], [], []]);
    })
    .then(({ lists, cards, members }: { lists: any, cards: any, members: any }) => {
      return Promise.resolve(ListWithCard.make({ lists, cards, members }));
    })
    .then((x: any) => Promise.resolve(Markdown.format(x)))
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

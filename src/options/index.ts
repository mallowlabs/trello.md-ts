import Trello from "trello-web";
import { trelloAppKey } from "../appkey";

const loginLink = document.getElementById("login-link");
loginLink?.addEventListener("click", (ev) => {
  console.log("Open options page");

  const client = new Trello(trelloAppKey);
  client
    .auth({
      name: "Trello.md",
      expiration: "never",
      scope: { read: true, write: false, account: false },
    })
    .then(() => {
      chrome.storage.local.set({ token: client.token || "" }, () => {
        console.log("Close options page");
        window.close();
      });
    });

  ev.preventDefault();
});

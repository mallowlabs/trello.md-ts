import Trello from "trello-web";
import { trelloAppKey } from "../appkey";

const toggle = () => {
  chrome.storage.local.get(["token"]).then((result) => {
    const loginBlock = document.getElementById("login-block");
    const logoutBlock = document.getElementById("logout-block");
    if (!result.token) {
      loginBlock?.classList?.remove("hide");
      logoutBlock?.classList?.add("hide");
    } else {
      loginBlock?.classList?.add("hide");
      logoutBlock?.classList?.remove("hide");
    }
  });
};

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

const logoutLink = document.getElementById("logout-link");
logoutLink?.addEventListener("click", () => {
  chrome.storage.local.remove("token").then(() => {
    toggle();
  });
});

toggle();

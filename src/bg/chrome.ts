namespace Tabs {
  export type tab = {
    url: string | null;
    id: number;
  };

  export namespace OnUpdated {
    export function add_listener(
      callback: (id: number) => (changeInfo: any) => (tab: tab) => void
    ): void {
      return chrome.tabs.onUpdated.addListener(callback);
    }
  }
}

namespace PageAction {
  export function show(tabId: number): void {
    return chrome.pageAction.show(tabId);
  }
  export function set_icon(details: { tabId: number; path: string }): void {
    return chrome.pageAction.setIcon(details);
  }

  export namespace OnClicked {
    export function add_listener(callback: (tab: chrome.tabs.Tab) => void): void {
      return chrome.pageAction.onClicked.addListener(callback);
    }
  }
}

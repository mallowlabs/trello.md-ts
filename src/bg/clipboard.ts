const copyToClipboard = (textToCopy: string) => {
  const listener = (event: any) => {
    event.clipboardData.setData("text/plain", `${textToCopy}`);
    event.preventDefault();
  };
  document.addEventListener("copy", listener);
  document.execCommand("copy");
  document.removeEventListener("copy", listener);
};

export class Clipboard {
  static write(tabId: number, value: string): void {
    chrome.scripting.executeScript({
      target: { tabId },
      func: copyToClipboard,
      args: [value],
    });
  }
}

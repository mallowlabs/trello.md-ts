export class Clipboard {
  static write(document: Document, value: string): void {
    const textarea = document.getElementById("ta") as HTMLInputElement; // FIXME
    textarea.value = value;
    textarea.select();
    if (!document.execCommand("copy")) {
      throw new Error("fail to write clipboard");
    }
  }
}

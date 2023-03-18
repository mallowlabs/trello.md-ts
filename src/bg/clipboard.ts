//type document;

// type element = {
//   value: string;
//   select: () => void;
// };

//declare var document: document;
// declare function get_element_by_id(
//   doc: Document,
//   id: string
// ): element;
// declare function exec_command(doc: Document, command: string): boolean;

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

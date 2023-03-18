type document;

type element = {
  value: string;
  select: () => void;
};

declare var document: document;
declare function get_element_by_id(
  doc: document,
  id: string
): element;
declare function exec_command(doc: document, command: string): boolean;

function write(value: string): void {
  let textarea = get_element_by_id(document, "ta");
  textarea.value = value;
  textarea.select();
  if (!exec_command(document, "copy")) {
    throw new Error("fail to write clipboard");
  }
}

import type { Parent } from 'unist';
import { visit } from 'unist-util-visit';

type AnyNode = {
  attributes?: Array<Record<string, unknown>>;
  children?: Array<AnyNode>;
  name?: string;
  type: string;
  value?: string;
};

const plugin = (tree: Parent) => {
  let counter = 0;

  visit(tree, 'paragraph', (paragraph: AnyNode) => {
    const children = paragraph.children;
    if (!Array.isArray(children) || children.length === 0) {
      return;
    }

    const out: Array<AnyNode> = [];

    let inNote = false;
    let noteChildren: Array<AnyNode> = [];
    let noteNumber = 0;

    const flushUnclosedNote = () => {
      out.push({ type: 'text', value: '^[' }, ...noteChildren);
      inNote = false;
      noteChildren = [];
      noteNumber = 0;
    };

    const closeNote = () => {
      out.push({
        attributes: [
          {
            name: 'id',
            type: 'mdxJsxAttribute',
            value: noteNumber,
          },
        ],
        children: noteChildren.length
          ? noteChildren
          : [{ type: 'text', value: '' }],
        name: 'InlineNote',
        type: 'mdxJsxTextElement',
      });
      inNote = false;
      noteChildren = [];
      noteNumber = 0;
    };

    for (const node of children) {
      if (node.type !== 'text' || typeof node.value !== 'string') {
        if (inNote) {
          noteChildren.push(node);
        } else {
          out.push(node);
        }
        continue;
      }

      const s: string = node.value;
      let k = 0;

      while (k < s.length) {
        if (!inNote) {
          const start = s.indexOf('^[', k);
          if (start === -1) {
            const tail = s.slice(k);
            if (tail) {
              out.push({ type: 'text', value: tail });
            }
            break;
          }

          const before = s.slice(k, start);
          if (before) {
            out.push({ type: 'text', value: before });
          }

          inNote = true;
          noteChildren = [];
          noteNumber = ++counter;
          k = start + 2;
          continue;
        } else {
          const end = s.indexOf(']', k);
          if (end === -1) {
            const tail = s.slice(k);
            if (tail) {
              noteChildren.push({ type: 'text', value: tail });
            }
            break;
          }

          const inside = s.slice(k, end);
          if (inside) {
            noteChildren.push({ type: 'text', value: inside });
          }

          closeNote();
          k = end + 1;
          continue;
        }
      }
    }

    if (inNote) {
      flushUnclosedNote();
    }

    paragraph.children = out;
  });
};

export default function remarkInlineNotes() {
  return plugin;
}

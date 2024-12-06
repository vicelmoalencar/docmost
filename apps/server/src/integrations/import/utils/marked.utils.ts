import { marked } from 'marked';
import { calloutExtension } from './callout.marked';

marked.use({
  renderer: {
    // @ts-ignore
    list(body: string, isOrdered: boolean, start: number) {
      if (isOrdered) {
        const startAttr = start !== 1 ? ` start="${start}"` : '';
        return `<ol ${startAttr}>\n${body}</ol>\n`;
      }

      const dataType = body.includes(`<input`) ? ' data-type="taskList"' : '';
      return `<ul${dataType}>\n${body}</ul>\n`;
    },
    // @ts-ignore
    listitem({ text, raw, task: isTask, checked: isChecked }): string {
      if (!isTask) {
        return `<li>${text}</li>\n`;
      }
      const checkedAttr = isChecked
        ? 'data-checked="true"'
        : 'data-checked="false"';
      return `<li data-type="taskItem" ${checkedAttr}>${text}</li>\n`;
    },
  },
});

marked.use({ extensions: [calloutExtension] });

export async function markdownToHtml(markdownInput: string): Promise<string> {
  const YAML_FONT_MATTER_REGEX = /^\s*---[\s\S]*?---\s*/;

  const markdown = markdownInput
    .replace(YAML_FONT_MATTER_REGEX, '')
    .trimStart();

  return marked.parse(markdown);
}

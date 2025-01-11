import { Plugin, MarkdownPostProcessor, MarkdownPostProcessorContext } from 'obsidian'

// Regular Expression for {{kanji|kana|kana|...}} format
const REGEXP = /{((?:[\u2E80-\uA4CF\uFF00-\uFFEF])+)((?:\\?\|[^ -\/{-~:-@\[-`]*)+)}/gm;

// Main Tags to search for Furigana Syntax
const TAGS = 'p, h1, h2, h3, h4, h5, h6, ol, ul, table'

const convertFurigana = (element: Text): Node => {
  // Normalize the text content (replace Japanese full-width characters with standard ones)
  const normalizedText = element.textContent
    ?.replace(/｛/g, '{')
    .replace(/｝/g, '}')
    .replace(/｜/g, '|') || '';

  // Replace matches in the text with ruby elements
  const updatedHTML = normalizedText.replace(REGEXP, (_, kanji, furigana) => {
    const furiParts = furigana.split('|').slice(1); // Remove the leading separator
    const kanjiParts = furiParts.length === 1 ? [kanji] : kanji.split('');

    if (kanjiParts.length !== furiParts.length) {
      // If the number of kanji and furigana parts don't match, return the original match
      return `{${kanji}|${furigana}}`;
    }

    // Construct the ruby element as an HTML string
    const rubyContent = kanjiParts
      .map((char, i) => `${char}<rt>${furiParts[i]}</rt>`)
      .join('');
    return `<ruby class="furi">${rubyContent}</ruby>`;
  });

  // Replace the original text node with an HTML element
  const parentNode = element.parentNode!;
  const span = document.createElement('span');
  span.innerHTML = updatedHTML;
  parentNode.replaceChild(span, element);

  return span;
};


export default class MarkdownFurigana extends Plugin {
  public postprocessor: MarkdownPostProcessor = (el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
    const blockToReplace = el.querySelectorAll(TAGS)
    if (blockToReplace.length === 0) return

    function replace(node: Node) {
      const childrenToReplace: Text[] = []
      node.childNodes.forEach(child => {
        if (child.nodeType === 3) {
          // Nodes of Type 3 are TextElements
          childrenToReplace.push(child as Text)
        } else if (child.hasChildNodes() && child.nodeName !== 'CODE' && child.nodeName !== 'RUBY') {
          // Ignore content in Code Blocks
          replace(child)
        }
      })
      childrenToReplace.forEach((child) => {
        child.replaceWith(convertFurigana(child))
      })
    }

    blockToReplace.forEach(block => {
      replace(block)
    })
  }

  async onload() {
    console.log('loading Markdown Furigana plugin')
    this.registerMarkdownPostProcessor(this.postprocessor)
  }

  onunload() {
    console.log('unloading Markdown Furigana plugin')
  }
}

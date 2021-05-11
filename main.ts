import { Plugin, MarkdownPostProcessor, MarkdownPostProcessorContext } from 'obsidian'

// Regular Expression for {{kanji|kana|kana|...}} format
const REGEXP = /{((?:[一-龯]|[ぁ-んァ-ン])+)((?:\|[ぁ-んァ-ン]*)+)}/gm

// Main Tags to search for Furigana Syntax
const TAGS = 'p, h1, h2, h3, h4, h5, h6, ol, ul, table'

const convertFurigana = (element:Text): Node => {
  const matches = Array.from(element.textContent.matchAll(REGEXP))
  for (const match of matches) {
    const furi = match[2].split('|').slice(1) // First Element will be empty
    const kanji = furi.length === 1 ? [match[1]] : match[1].split('')
    if (kanji.length === furi.length) {
      // Number of Characters in first section must be equal to number of furigana sections (unless only one furigana section)
      const rubyNode = document.createElement('ruby')
      rubyNode.addClass('furi')
      kanji.forEach((k, i) => {
        rubyNode.appendText(k)
        rubyNode.createEl('rt', { text: furi[i] })
      })
      const nodeToReplace = element.splitText(element.textContent.indexOf(match[0]))
      element = nodeToReplace.splitText(match[0].length)
      nodeToReplace.replaceWith(rubyNode)
    }
  }
  return element
}

export default class MarkdownFurigana extends Plugin {
    public postprocessor: MarkdownPostProcessor = (el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
      const blockToReplace = el.querySelector(TAGS)
      if (!blockToReplace) return

      function replace (node:Node) {
        node.childNodes.forEach(child => {
          if (child.nodeType === 3) {
            // Nodes of Type 3 are TextElements
            child.replaceWith(convertFurigana(child as Text))
          } else if (child.hasChildNodes() && child.nodeName !== 'CODE') {
            // Ignore content in Code Blocks
            replace(child)
          }
        })
      }
      replace(blockToReplace)
    }

    async onload () {
      console.log('loading Markdown Furigana plugin')
      this.registerMarkdownPostProcessor(this.postprocessor)
    }

    onunload () {
      console.log('unloading Markdown Furigana plugin')
    }
}

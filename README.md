## Update

- Removed processing in source and editing mode.
- Simple hack to replace '{' '|' '}' IME fullwidth when postprocessing by { | and } not to have to switch keyboard when typing with the IME.
- Eg:  ｛編｜へん} typed fully with the japanese (mozc) will work.

### Setup

- Install dependencies with npm or yarn
- Build the project with the build command => main.js

#### Obsidian side
- Activate the normal furigana plugin
  ![img.png](img.png)
- Open the plugin location (your_vault/.obsidian/plugins/obsidian-markdown-furigana))
- Replace the main.js by the one produced by the 'build' command
- Toggle the plugin and reload obsidian (optional)

# Source Project

## Markdown Furigana Plugin (Obsidian)

Simple markdown to furigana rendering plugin for displaying Japanese text with [furigana](https://en.wikipedia.org/wiki/Furigana) in Obsidian (https://obsidian.md).

**As of 1.2.0, the plugin is no longer limited to Japanese Text**

Based off of [markdown-it-ruby](https://github.com/lostandfound/markdown-it-ruby) syntax. All rendering is done post-processing when previewing, so your notes are not modified.

### Examples

Markdown|Processed As|Displays As
---|---|---
{漢字\|かんじ}|`<ruby>漢字<rt>かんじ</rt></ruby>`|<ruby>漢字<rt>かんじ</rt></ruby>
{漢字\|かん\|じ}|`<ruby>漢<rt>かん</rt>字<rt>じ</rt></ruby>`|<ruby>漢<rt>かん</rt>字<rt>じ</rt></ruby>
{北京\|ㄅㄟˇ\|ㄐㄧㄥ}|`<ruby>北<rt>ㄅㄟˇ</rt>京<rt>ㄐㄧㄥ</rt></ruby>`|<ruby>北<rt>ㄅㄟˇ</rt>京<rt>ㄐㄧㄥ</rt></ruby>
{北京\|Běi\|jīng}|`<ruby>北<rt>Běi</rt>京<rt>jīng</rt></ruby>`|<ruby>北<rt>Běi</rt>京<rt>jīng</rt></ruby>
{韓國\|한\|국}|`<ruby>韓<rt>한</rt>國<rt>국</rt></ruby>`|<ruby>韓<rt>한</rt>國<rt>국</rt></ruby>


### Additional Info

The plugin expects the first section to be Kanji or Kana, and furigana sections to be Hiragana or Katakana. If more than one furigana section, there must be as many as the number of characters in the first section. Sections of furigana can also be empty.

### See Also

Also check out the [Obsidian Furigana](https://github.com/uonr/obsidian-furigana) plugin if you prefer to use the ruby syntax directly in your notes.

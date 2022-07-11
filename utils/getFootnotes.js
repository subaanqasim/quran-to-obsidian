import fetch from "node-fetch";
import { NodeHtmlMarkdown } from "node-html-markdown";
import Bottleneck from "bottleneck";

const nhm = new NodeHtmlMarkdown();
const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1500,
});

const footnoteRefRegex = /(?<=\=)(.*?)(?=\>)/g;

export default async function getFootnotes(translationText, quranFilePrefix) {
  const footnoteRefs = translationText.match(footnoteRefRegex);

  if (footnoteRefs === null) {
    return null;
  }

  let results = [];

  for (const [i, ref] of footnoteRefs.entries()) {
    const res = await limiter.schedule(() =>
      fetch(`https://api.qurancdn.com/api/qdc/foot_notes/${ref}`)
    );
    const data = await res.json();
    let text = nhm.translate(data.foot_note.text).trim();

    // if verseKey (e.g. [2:25]) is present
    if (/^.*?\[(\d+):(\d+)\].*$/.test(text) === true) {
      // match to get verse key(s)
      const surahNum = [...text.matchAll(/\[(\d+)\:/g)][0][1];
      const verseNum = [...text.matchAll(/\:(\d+)\]/g)][0][1];

      //replace href with obsidian wikilink
      text = text.replace(
        /\[(.*?)\)/,
        `[[${quranFilePrefix}${surahNum} - ${verseNum}|${surahNum}:${verseNum}]]`
      );
    }

    results = [...results, { footnoteNum: i + 1, ref, text }];
  }

  return results;
}

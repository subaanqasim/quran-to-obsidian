import { NodeHtmlMarkdown } from "node-html-markdown";
const nhm = new NodeHtmlMarkdown();
export default function parseTranslationHtml(translationText) {
  // replaces numbers in <sup> tags with markdown footnote format e.g. <sup>1</sup> --> <sup>[^1]</sup>
  const supNums = translationText.replace(
    /(?<=\>)(\d+)(?=\<)/g,
    (match) => `[^${match}]`
  );

  //parses html to markdown and removes '\' escape characters
  const parsedHtml = nhm.translate(supNums).replace(/\\/g, "");

  return parsedHtml;
}

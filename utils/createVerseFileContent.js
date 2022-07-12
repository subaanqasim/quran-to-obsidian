import getFootnotes from "./getFootnotes.js";
import parseTranslationHtml from "./parseTranslationHtml.js";

export default async function createVerseFileContent(
  verse,
  verseFileName,
  surah,
  surahFileName,
  quranFilePrefix
) {
  // TODO: fix sorting somehow - ?base on file.ctime

  const footnotes = await getFootnotes(verse.english, quranFilePrefix);

  const footnoteText =
    footnotes === null
      ? ""
      : footnotes.reduce((acc, footnote, i) => {
          console.log(`Adding footnote ${i + 1}...`);

          return (acc += `[^${footnote.footnoteNum}]: ${footnote.text}\n`);
        }, "");

  const parsedTranslation = parseTranslationHtml(verse.english);

  return `
---
aliases: ["${verse.verseKey}", "Surah ${surah.name}, verse ${verse.verseNumber}", "Qur'an ${verse.verseKey}"]
tags: Qvref
---

parent:: [[${surahFileName}|${surah.name}]]

> [!arabic]+ Surah ${surah.name}, Verse ${verse.verseNumber} (${verse.verseKey})
> <span class="quran-arabic">${verse.arabic}</span>
^arabic

> [!translation]+ Surah ${surah.name}, Verse ${verse.verseNumber} (${verse.verseKey}) - Translation
> ${parsedTranslation}
^translation

${footnoteText}

## Related notes
\`\`\`dataview
LIST from [[${verseFileName}]]
WHERE !contains(file.name, "${quranFilePrefix}")
SORT file.name ASC
\`\`\`

### Related verses (footnote backlinks)
\`\`\`dataview
LIST FROM [[${verseFileName}]] AND #Qvref
SORT file.name ASC
\`\`\`

`;
}

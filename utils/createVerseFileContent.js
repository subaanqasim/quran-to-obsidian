export default function createVerseFileContent(
  verse,
  verseFileName,
  surah,
  surahFileName,
  quranFilePrefix
) {
  // TODO: ADD FOOTNOTES SECTION under 'translation' callout

  // TODO: Add 'related verses' dataview section at bottom to allow for 'see footnote for x verse' footnote link

  // TODO: fix sorting somehow ?base on file.ctime
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
> ${verse.english}
^translation


## Related notes
\`\`\`dataview
LIST from [[${verseFileName}]]
WHERE !contains(file.name, "${quranFilePrefix}")
SORT file.name ASC
\`\`\`

`;
}

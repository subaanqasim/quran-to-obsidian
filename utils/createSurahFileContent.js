export default function createSurahFileContent(
  surah,
  surahFileName,
  quranFilePrefix
) {
  // TODO: fix sorting somehow ?base on file.ctime
  console.log(`Generating surah ${surah.name} markdown content...`);
  return `
---
aliases: ["Surah ${surah.name}", "Chapter 2"]
tags: Qsref
verses: ${surah.totalVerses}
revelationPlace: ${surah.revelationPlace}
revelationOrder: ${surah.revelationOrder}
---

# Surah ${surah.name}

> [!info]+ About Surah ${surah.name}
> ${surah.shortExcerpt}

## Related notes
\`\`\`dataview
LIST from [[${surahFileName}]]
WHERE !contains(file.name, "${quranFilePrefix}")
SORT file.name ASC
\`\`\`

---

## Verses
\`\`\`dataview
LIST WITHOUT ID link(file.name, replace(file.name, "${quranFilePrefix}", "")) FROM [[${surahFileName}]]
WHERE contains(file.name, "${quranFilePrefix}")
SORT file.name ASC
\`\`\`

`;
}

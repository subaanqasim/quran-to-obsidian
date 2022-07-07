import fs from "fs-extra";
// import promptSync from "prompt-sync";
import { createSurahsJson } from "./utils/createSurahData";
import createSurahFileContent from "./utils/createSurahFileContent";
import { createVersesJson } from "./utils/createVersesData";
import createVerseFileContent from "./utils/createVerseFileContent";

// const prompt = promptSync();
// const vaultPath = prompt("Enter the full directory to your vault root: ");
// const vaultPathQuran = `${vaultPath}/Quran`

const vaultPathQuran = "./Quran";

if (!fs.pathExistsSync("./data/surahData.json")) {
  console.log("Creating Surah data...");

  createSurahsJson();

  console.log("✔ Created Surah Data");
}

const { surahs } = fs.readJsonSync("./data/surahData.json");
const quranFilePrefix = "q - ";

for (const surah of surahs) {
  // create folder for current surah
  const surahFolderPath = `${vaultPathQuran}/${surah.name}`;

  fs.ensureDir(surahFolderPath, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    // create md file for current surah
    const surahFileName = `${quranFilePrefix}${surah.name} (${surah.id})`;
    const surahFilePath = `${surahFolderPath}/${surahFileName}.md`;
    const surahFileContent = createSurahFileContent(
      surah,
      surahFileName,
      quranFilePrefix
    );

    fs.outputFile(surahFilePath, surahFileContent, (err) => {
      if (err) {
        console.log(err);
      }
    });

    // check to see if verses data for current surah exists
    if (!fs.pathExistsSync(`./data/verses/${surah.id}.json`)) {
      createVersesJson(surah.id);
    }

    const { verses } = fs.readJsonSync(`./data/verses/${surah.id}.json`);

    // create file for each ayah of current surah
    for (const verse of verses) {
      const verseFileName = `${quranFilePrefix}${surah.id} - ${verse.verseNumber}`;
      const verseFilePath = `${surahFolderPath}/${verseFileName}.md`;
      const verseFileContent = createVerseFileContent(
        verse,
        verseFileName,
        surah,
        surahFileName,
        quranFilePrefix
      );

      fs.outputFile(verseFilePath, verseFileContent, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  });
}

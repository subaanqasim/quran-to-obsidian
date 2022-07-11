import fs from "fs-extra";
// import promptSync from "prompt-sync";
import { createSurahsJson } from "./utils/createSurahData.js";
import createSurahFileContent from "./utils/createSurahFileContent.js";
import { createVersesJson } from "./utils/createVersesData.js";
import createVerseFileContent from "./utils/createVerseFileContent.js";

// const prompt = promptSync();
// const vaultPath = prompt("Enter the full directory to your vault root: ");
// const vaultPathQuran = `${vaultPath}/Quran`

const vaultPathQuran = "./Quran";
const quranFilePrefix = "q - ";

if (!fs.pathExistsSync("./data/surahData.json")) {
  console.log("Creating Surah data...");

  await createSurahsJson();

  console.log("✔ Created Surah Data");
}

const { surahs } = fs.readJsonSync("./data/surahData.json");

(function quranToObsidian() {
  for (const surah of surahs) {
    // create folder for current surah
    const surahFolderPath = `${vaultPathQuran}/${surah.name}`;

    (async function createFiles() {
      try {
        await fs.ensureDir(surahFolderPath);
        // create md file for current surah
        const surahFileName = `${quranFilePrefix}${surah.name} (${surah.id})`;
        const surahFilePath = `${surahFolderPath}/${surahFileName}.md`;
        const surahFileContent = createSurahFileContent(
          surah,
          surahFileName,
          quranFilePrefix
        );

        await fs.outputFile(surahFilePath, surahFileContent);

        // check to see if verses data for current surah exists
        if (!fs.pathExistsSync(`./data/verses/${surah.id}.json`)) {
          createVersesJson(surah.id);
        }

        const { verses } = fs.readJsonSync(`./data/verses/${surah.id}.json`);

        // create file for each ayah of current surah
        for (const verse of verses) {
          const verseFileName = `${quranFilePrefix}${surah.id} - ${verse.verseNumber}`;
          const verseFilePath = `${surahFolderPath}/${verseFileName}.md`;
          const verseFileContent = await createVerseFileContent(
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
      } catch (err) {
        console.error(err);
      }
    })();
  }
})();

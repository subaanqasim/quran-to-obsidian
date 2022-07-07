import fs from "fs-extra";
import fetch from "node-fetch";

const getChapterVerses = async (chapterNum) => {
  console.log(`Fetching ch. ${chapterNum} data`);
  try {
    const res = await fetch(
      `https://api.quran.com/api/v4/verses/by_chapter/${chapterNum}?language=en&per_page=1000&translations=131&fields=text_uthmani`
    );

    if (res.status >= 200 && res.status <= 299) {
      const data = await res.json();

      return data.verses;
    } else {
      throw new Error(res);
    }
  } catch (err) {
    console.error(`Error fetching ch. ${chapterNum}`);
    console.error("Status: ", err.status);
    console.error("Message: ", err.error);

    return;
  }
};

// TODO: regexReplace <sup></sup> with md footnote syntax e.g. [^1]

// TODO: parse foot_note attribute using regex to get footnote number
//   call footnote api
//   regexReplace href to absolute url, OR replace whole <a></a> tag to wikilink to md file
//   parse html footnotes to md using nhm
//   add footnotes text to array
//
//   add footnotes text arr to english translation
//     e.g. english: {
//              text: v.translations[0].text,
//              footnotes: ["footnote 1 text", "footnote 2 text"]
//           }

export async function createVersesJson(chapterNum) {
  const verses = await getChapterVerses(chapterNum);

  console.log(`Mapping verses for ch. ${chapterNum}`);

  const mappedVerses = verses.map((v) => ({
    id: v.id,
    verseNumber: v.verse_number,
    verseKey: v.verse_key,
    arabic: v.text_uthmani,
    english: v.translations[0].text,
  }));

  const final = { verses: [...mappedVerses] };

  try {
    console.log(`Creating verses JSON file for ch. ${chapterNum}`);

    await fs.outputJson(`../data/verses/${chapterNum}.json`, final);

    console.log(`Completed JSON creation for ch. ${chapterNum}`);
  } catch (err) {
    console.error(err);
  }
}

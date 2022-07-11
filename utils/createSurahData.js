import fs from "fs-extra";
import fetch from "node-fetch";
import { NodeHtmlMarkdown } from "node-html-markdown";

const nhm = new NodeHtmlMarkdown();

const getSurahSummary = async (id) => {
  console.log(`Fetching ch. ${id} info...`);

  try {
    const res = await fetch(
      `https://api.quran.com/api/v4/chapters/${id}/info?language=en`
    );

    if (res.status >= 200 && res.status <= 299) {
      const data = await res.json();

      return {
        summary: data.chapter_info.text,
        excerpt: data.chapter_info.short_text,
      };
    } else {
      throw new Error(res);
    }
  } catch (err) {
    console.error(`Error fetching ch. ${id} info`);
    console.error("Status: ", err.status);
    console.error("Message: ", err.error);

    return;
  }
};

export async function createSurahsJson() {
  let surahData = [];

  const res = await fetch("https://api.quran.com/api/v4/chapters?language=en");
  const data = await res.json();
  const surahs = data.chapters;

  for (const s of surahs) {
    const surahInfo = await getSurahSummary(s.id);
    console.log(`Fetched ch. ${s.id} info ✅`);
    // TODO: create function to regexReplace relative href to absolute
    // can't do wikilink as it is a usually a range of ayat
    surahData = [
      ...surahData,
      {
        id: s.id,
        name: s.name_simple,
        nameTranslated: s.translated_name.name,
        totalVerses: s.verses_count,
        revelationPlace: s.revelation_place,
        revelationOrder: s.revelation_order,
        shortExcerpt: surahInfo.excerpt,
        summary: surahInfo.summary, //TODO: PARSE TO MARKDOWN USING NHM
      },
    ];
  }
  const final = { surahs: [...surahData] };

  try {
    console.log("Creating surahData.json ...");

    await fs.outputJson("./data/surahData.json", final);
  } catch (err) {
    console.error(err);
  }
}

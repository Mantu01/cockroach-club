import * as cheerio from "cheerio";

import { fetchHTML } from "../fetcher.js";

import {
  JobItem,
  JobSearchParams,
} from "../../../types/job.types.js";

export async function scrapeRemoteOK(
  params: JobSearchParams
): Promise<JobItem[]> {
  const keyword =
    params.keyword || "";

  const url = `https://remoteok.com/remote-${encodeURIComponent(
    keyword
  )}-jobs`;

  const html = await fetchHTML(url);

  const $ = cheerio.load(html);

  const jobs: JobItem[] = [];

  $("tr.job").each((_, el) => {
    const title = $(el)
      .find("h2")
      .text()
      .trim();

    const company = $(el)
      .find("h3")
      .text()
      .trim();

    const location = $(el)
      .find(".location")
      .text()
      .trim();

    const tags: string[] = [];

    $(el)
      .find(".tag")
      .each((_, tag) => {
        tags.push(
          $(tag).text().trim()
        );
      });

    const applyUrl =
      "https://remoteok.com" +
      ($(el).attr("data-href") ||
        "");

    jobs.push({
      title,

      company,

      location,

      remote: true,

      jobMode: "remote",

      skills: tags,

      technologies: tags,

      tags,

      requirements: tags,

      applyUrl,

      source: "RemoteOK",

      scrapedAt:
        new Date().toISOString(),
    });
  });

  return jobs;
}
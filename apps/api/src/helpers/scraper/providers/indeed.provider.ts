import * as cheerio from "cheerio";

import { fetchHTML } from "../fetcher.js";

import {
  JobItem,
  JobSearchParams,
} from "../../../types/job.types.js";

import {
  extractListItems,
  extractSkills,
  inferJobMode,
  normalizeText,
} from "../utils.js";

export async function scrapeIndeed(
  params: JobSearchParams
): Promise<JobItem[]> {
  const {
    keyword = "",
    location = "",
    type,
    postedWithin,
  } = params;

  const query =
    encodeURIComponent(keyword);

  const loc =
    encodeURIComponent(location);

  let fromage = "";

  switch (postedWithin) {
    case "1h":
      fromage = "1";
      break;

    case "24h":
      fromage = "1";
      break;

    case "7d":
      fromage = "7";
      break;

    case "30d":
      fromage = "30";
      break;

    default:
      fromage = "30";
  }

  const url = `https://www.indeed.com/jobs?q=${query}&l=${loc}&fromage=${fromage}`;

  const html = await fetchHTML(url);

  const $ = cheerio.load(html);

  const jobs: JobItem[] = [];

  $(".job_seen_beacon").each(
    (_, element) => {
      const title = normalizeText(
        $(element)
          .find("h2.jobTitle")
          .text()
      );

      const company = normalizeText(
        $(element)
          .find(
            "[data-testid='company-name']"
          )
          .text()
      );

      const location = normalizeText(
        $(element)
          .find(
            "[data-testid='text-location']"
          )
          .text()
      );

      const description = normalizeText(
        $(element)
          .find(".job-snippet")
          .text()
      );

      const salary = normalizeText(
        $(element)
          .find(".salary-snippet")
          .text()
      );

      const relativeLink = $(element)
        .find("a")
        .attr("href");

      const applyUrl = relativeLink
        ? `https://indeed.com${relativeLink}`
        : "";

      const skills = extractSkills(
        description || ""
      );

      const requirements =
        extractListItems(
          description || ""
        );

      const jobMode =
        inferJobMode(location || "");

      if (
        type &&
        jobMode !== type
      ) {
        return;
      }

      jobs.push({
        title: title || "",

        company: company || "",

        location: location || "",

        remote:
          jobMode === "remote",

        jobMode,

        salary: salary || "",

        description,

        shortDescription:
          description?.slice(0, 250),

        skills,

        requirements,

        qualifications:
          requirements,

        responsibilities:
          requirements,

        technologies: skills,

        applyUrl,

        source: "Indeed",

        postedAt: new Date().toISOString(),

        scrapedAt:
          new Date().toISOString(),
      });
    }
  );

  return jobs;
}
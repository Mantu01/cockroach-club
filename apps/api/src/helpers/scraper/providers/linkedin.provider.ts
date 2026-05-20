import * as cheerio from "cheerio";

import { fetchHTML } from "../fetcher.js";

import {
  JobItem,
  JobSearchParams,
} from "../../../types/job.types.js";

import {
  extractSkills,
  normalizeText,
  inferJobMode,
} from "../utils.js";

export async function scrapeLinkedIn(
  params: JobSearchParams
): Promise<JobItem[]> {
  const {
    keyword = "",
    location = "",
  } = params;

  const url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${encodeURIComponent(
    keyword
  )}&location=${encodeURIComponent(
    location
  )}`;

  const html = await fetchHTML(url);

  const $ = cheerio.load(html);

  const jobs: JobItem[] = [];

  $(".base-card").each((_, el) => {
    const title = normalizeText(
      $(el)
        .find(
          ".base-search-card__title"
        )
        .text()
    );

    const company = normalizeText(
      $(el)
        .find(
          ".base-search-card__subtitle"
        )
        .text()
    );

    const location = normalizeText(
      $(el)
        .find(
          ".job-search-card__location"
        )
        .text()
    );

    const postedAt = $(el)
      .find("time")
      .attr("datetime");

    const applyUrl = $(el)
      .find("a")
      .attr("href");

    const description = normalizeText(
      $(el)
        .text()
        .slice(0, 1500)
    );

    const skills = extractSkills(
      description || ""
    );

    const jobMode =
      inferJobMode(location || "");

    jobs.push({
      title: title || "",

      company: company || "",

      location: location || "",

      description,

      shortDescription:
        description?.slice(0, 250),

      skills,

      technologies: skills,

      requirements: skills,

      remote:
        jobMode === "remote",

      jobMode,

      applyUrl: applyUrl || "",

      source: "LinkedIn",

      postedAt,

      scrapedAt:
        new Date().toISOString(),
    });
  });

  return jobs;
}
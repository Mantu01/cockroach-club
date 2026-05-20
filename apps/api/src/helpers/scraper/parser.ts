import pLimit from "p-limit";

import {
  JobItem,
  JobSearchParams,
} from "../../types/job.types.js";

import { scrapeIndeed } from "./providers/indeed.provider.js";

import { scrapeLinkedIn } from "./providers/linkedin.provider.js";

import { scrapeRemoteOK } from "./providers/remoteok.provider.js";

const limit = pLimit(2);

export async function scrapeAllJobs(
  params: JobSearchParams
) {
  const jobs =
    await Promise.allSettled([
      limit(() =>
        scrapeIndeed(params)
      ),

      limit(() =>
        scrapeLinkedIn(params)
      ),

      limit(() =>
        scrapeRemoteOK(params)
      ),
    ]);

  let results = jobs
    .filter(
      (j) => j.status === "fulfilled"
    )
    .flatMap((j: any) => j.value);

  results =
    removeDuplicates(results);

  results = applyFilters(
    results,
    params
  );

  return paginate(
    results,
    params.page || 1,
    params.limit || 20
  );
}

function applyFilters(
  jobs: JobItem[],
  params: JobSearchParams
) {
  return jobs.filter((job) => {
    if (
      params.type &&
      job.jobMode !== params.type
    ) {
      return false;
    }

    if (
      params.skills?.length
    ) {
      const hasSkill =
        params.skills.some((skill) =>
          job.skills?.includes(skill)
        );

      if (!hasSkill) {
        return false;
      }
    }

    if (
      params.domain &&
      !job.description
        ?.toLowerCase()
        .includes(
          params.domain.toLowerCase()
        )
    ) {
      return false;
    }

    return true;
  });
}

function paginate(
  jobs: JobItem[],
  page: number,
  limit: number
) {
  const start =
    (page - 1) * limit;

  const end = start + limit;

  return {
    page,

    limit,

    total: jobs.length,

    totalPages: Math.ceil(
      jobs.length / limit
    ),

    jobs: jobs.slice(start, end),
  };
}

function removeDuplicates(
  jobs: JobItem[]
) {
  const seen = new Set();

  return jobs.filter((job) => {
    const key = `${job.title}-${job.company}`;

    if (seen.has(key))
      return false;

    seen.add(key);

    return true;
  });
}
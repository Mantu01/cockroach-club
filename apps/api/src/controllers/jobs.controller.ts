import { Request, Response } from "express";
import { scrapeAllJobs } from "../helpers/scraper/parser.js";
import Job from "../models/job.model.js";
import { JobSearchParams } from "../types/job.types.js";

export async function getJobs(
  req: Request,
  res: Response
) {
  try {
    const params: JobSearchParams = {
      keyword: String(req.query.keyword || ''),
      location: String(req.query.location || ''),
      country: String(req.query.country || ''),
      domain: String(req.query.domain || ''),
      type: req.query.type as any,
      postedWithin: req.query.postedWithin as any,
      experienceLevel: String(req.query.experienceLevel || ''),
      company: String(req.query.company || ''),
      salaryMin: Number(req.query.salaryMin) || undefined,
      salaryMax: Number(req.query.salaryMax) || undefined,
      skills: req.query.skills
        ? String(req.query.skills)
            .split(',')
            .map((value) => value.trim())
            .filter(Boolean)
        : [],
      page: Number(req.query.page || 1),
      limit: Number(req.query.limit || 20),
      sortBy: req.query.sortBy as any,
    };

    const scraped = await scrapeAllJobs(params);
    const jobsToSave = scraped.jobs.map((job) => {
      const url = job.applyUrl || '';
      return {
        title: job.title,
        company: job.company,
        location: job.location,
        source: job.source,
        url,
        salary: job.salary,
        type: job.employmentType || job.jobMode || 'Full-time',
        tags: job.tags ?? [],
        description: job.description || job.shortDescription || '',
        requirements: job.requirements ?? [],
        responsibilities: job.responsibilities ?? [],
        qualifications: job.qualifications ?? [],
        skills: job.skills ?? [],
        companyLogo: job.companyLogo,
        companyWebsite: job.companyWebsite,
        postedAt: job.postedAt ? new Date(job.postedAt) : new Date(),
        scrapedAt: job.scrapedAt ? new Date(job.scrapedAt) : new Date(),
        experienceLevel: job.experience || job.seniorityLevel || '',
        remote: job.remote ?? job.jobMode === 'remote',
        currency: job.currency,
        salaryMin: Number(job.salaryMin) || undefined,
        salaryMax: Number(job.salaryMax) || undefined,
        employmentType: job.employmentType,
        seniorityLevel: job.seniorityLevel,
        domain: job.domain,
        industry: job.industry,
        benefits: job.benefits ?? [],
        technologies: job.technologies ?? [],
        language: job.language,
        jobId: job.jobId,
      };
    });

    if (jobsToSave.length > 0) {
      const writes = jobsToSave.map((job) => ({
        updateOne: {
          filter: {
            title: job.title,
            company: job.company,
            location: job.location,
            source: job.source,
            url: job.url,
          },
          update: { $set: job },
          upsert: true,
        },
      }));
      await Job.bulkWrite(writes);
    }

    const jobsWithIds = await Promise.all(
      jobsToSave.map(async (job) => {
        const doc = await Job.findOne({
          title: job.title,
          company: job.company,
          location: job.location,
          source: job.source,
          url: job.url,
        }).lean();
        return doc ?? job;
      })
    );

    return res.json({
      success: true,
      page: scraped.page,
      limit: scraped.limit,
      total: scraped.total,
      totalPages: scraped.totalPages,
      jobs: jobsWithIds,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Unable to fetch jobs',
    });
  }
}

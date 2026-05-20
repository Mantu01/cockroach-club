export function normalizeText(text?: string) {
  return text
    ?.replace(/\s+/g, " ")
    ?.trim();
}

export function extractSkills(
  text: string
): string[] {
  const commonSkills = [
    "React",
    "Next.js",
    "Node.js",
    "MongoDB",
    "TypeScript",
    "JavaScript",
    "AWS",
    "Docker",
    "Kubernetes",
    "GraphQL",
    "Redis",
    "PostgreSQL",
    "MySQL",
    "Python",
    "Java",
    "C++",
    "Tailwind",
    "Express",
    "Prisma",
  ];

  return commonSkills.filter((skill) =>
    text
      .toLowerCase()
      .includes(skill.toLowerCase())
  );
}

export function extractListItems(
  text: string
) {
  return text
    .split(/[•\n-]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 15);
}

export function inferJobMode(
  location: string
) {
  const lower = location.toLowerCase();

  if (lower.includes("remote"))
    return "remote";

  if (lower.includes("hybrid"))
    return "hybrid";

  return "onsite";
}
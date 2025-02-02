import { ExperienceCard } from "@/components/experience-card";
import { Section } from "@/components/ui/section";

import { data } from "@/data/resume-data";
const { education } = data;

export const Education = () => {
  return (
    <Section>
      <h2 className="text-xl">Education</h2>
      {education.map((education) => (
        <ExperienceCard
          key={`${education.institution}${education.studyType}`}
          item={{
            ...education,
            organization: education.institution,
            description: `${education.studyType} in ${education.area}`,
          }}
        />
      ))}
    </Section>
  );
};

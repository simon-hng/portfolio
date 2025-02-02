import { ExperienceCard } from "@/components/experience-card";
import { Section } from "@/components/ui/section";
import { data } from "@/data/resume-data";
const { work } = data;

export const Work = () => {
  return (
    <Section>
      <h2 className="text-xl">Work Experience</h2>
      {work.map((work) => (
        <ExperienceCard
          key={`${work.organization}${work.position}`}
          item={{
            ...work,
            description: work.position,
          }}
        />
      ))}
    </Section>
  );
};

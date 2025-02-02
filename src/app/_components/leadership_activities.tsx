import { ExperienceCard } from "@/components/experience-card";
import { Section } from "@/components/ui/section";
import { data } from "@/data/resume-data";
const { affiliations } = data;

export const LeadershipActivities = () => {
  return (
    <Section>
      <h2 className="text-xl">Leadership &amp; Activities</h2>
      {affiliations.map((affiliation) => (
        <ExperienceCard
          key={`${affiliation.organization}${affiliation.position}`}
          item={{
            ...affiliation,
            description: affiliation.position,
          }}
        />
      ))}
    </Section>
  );
};

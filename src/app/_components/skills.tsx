import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { data } from "@/data/resume-data";
const { skills } = data;

export const Skills = () => {
  return (
    <Section>
      <div>
        <h2 className="text-xl">Skills</h2>
        <p className="text-sm text-gray-500">
          Things I can write hello world in.
        </p>
      </div>

      <div className="flex min-w-0 flex-wrap gap-1.5 p-0.5">
        {skills
          .flatMap((skill) => skill.skills)
          .map((skill) => (
            <Badge key={skill} variant="secondary" className="shrink-0">
              {skill}
            </Badge>
          ))}
      </div>
    </Section>
  );
};

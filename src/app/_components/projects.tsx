import { ProjectCard } from "@/components/project-card";
import { Section } from "@/components/ui/section";
import { data } from "@/data/resume-data";
const { projects } = data;

export const Projects = () => {
  return (
    <Section className="scroll-mb-16">
      <h2 className="text-xl">Projects</h2>
      <div className="grid grid-cols-1 gap-3 md:-mx-4 md:grid-cols-2 lg:grid-cols-2">
        {projects.map((project) => {
          return (
            <ProjectCard
              key={project.name}
              title={project.name}
              description={project.highlights.join(" ")}
              tags={project.keywords}
              link={project.url}
            />
          );
        })}
      </div>
    </Section>
  );
};

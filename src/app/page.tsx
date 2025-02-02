import { CommandMenu } from "@/components/command-menu";
import { Metadata } from "next";

import { CVContent } from "./_components/blur-reveal";
import { data } from "@/data/resume-data";
import { Work } from "./_components/work";
import { Intro } from "./_components/intro";
import { LeadershipActivities } from "./_components/leadership_activities";
import { Education } from "./_components/education";
import { HonorsAwards } from "./_components/honors_awards";
import { Skills } from "./_components/skills";
import { Projects } from "./_components/projects";
const { personal } = data;

export const metadata: Metadata = {
  title: `${personal.name} | ${personal.about}`,
  description: personal.summary,
};

export default function Page() {
  const sections = [
    <Intro key="intro" />,
    <Work key="work" />,
    <Education key="education" />,
    <LeadershipActivities key="leadership" />,
    <HonorsAwards key="honors" />,
    <Skills key="skills" />,
    <Projects key="projects" />,
  ];

  return (
    <main className="relative mx-auto scroll-my-12 overflow-auto p-4 pb-12 md:p-16">
      <CVContent sections={sections} />

      <CommandMenu
        email={personal.email}
        links={[
          ...personal.profiles.map((profile) => ({
            url: profile.url,
            title: profile.network,
          })),
        ]}
      />
    </main>
  );
}

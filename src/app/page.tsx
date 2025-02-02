import { CommandMenu } from "@/components/command-menu";
import { Metadata } from "next";

import { Intro } from "./_components/intro";

import { Education } from "./_components/education";
import { Work } from "./_components/work";

import { HonorsAwards } from "./_components/honors_awards";
import { data } from "@/data/resume-data";
import { Projects } from "./_components/projects";
import { Skills } from "./_components/skills";
import { LeadershipActivities } from "./_components/leadership_activities";
import { BlurReveal } from "@/components/blur-reveal";
const { personal } = data;

export const metadata: Metadata = {
  title: `${personal.name} | ${personal.about}`,
  description: personal.summary,
};

export default function Page() {
  const sections = [
    Intro,
    Work,
    Education,
    LeadershipActivities,
    HonorsAwards,
    Skills,
    Projects,
  ];

  return (
    <main className="relative mx-auto scroll-my-12 overflow-auto p-4 pb-12 md:p-16">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-16">
        {sections.map((Section, index) => (
          <BlurReveal key={`section-${index}`} delay={index * 0.1}>
            <Section />
          </BlurReveal>
        ))}
      </div>

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

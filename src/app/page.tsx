import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommandMenu } from "@/components/command-menu";
import { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { Globe, Envelope, Phone } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project-card";
import { GithubLogo, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import { format } from "date-fns";

import { data } from "@/data/resume-data";
const { personal, work, education, projects, skills } = data;

export const metadata: Metadata = {
  title: `${personal.name} | ${personal.about}`,
  description: personal.summary,
};

export default function Page() {
  const formatDate = (date: Date | "present") => {
    if (date === "present") return "Present";
    return format(date, "LLL yyyy");
  };

  return (
    <main className="container relative mx-auto scroll-my-12 overflow-auto p-4 print:p-12 md:p-16">
      <section className="mx-auto w-full max-w-2xl space-y-8 bg-white print:space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-1.5">
            <h1 className="text-2xl font-bold">{personal.name}</h1>
            <p className="max-w-md text-pretty font-mono text-sm text-muted-foreground">
              {personal.about}
            </p>
            <p className="max-w-md items-center text-pretty font-mono text-xs text-muted-foreground">
              <a
                className="inline-flex gap-x-1.5 align-baseline leading-none hover:underline"
                href={`https://www.google.com/maps/place/${personal.location.city}`}
                target="_blank"
              >
                <Globe className="h-3 w-3" />
                {personal.location.city}, {personal.location.country}
              </a>
            </p>
            <div className="flex gap-x-1 pt-1 font-mono text-sm text-muted-foreground print:hidden">
              {personal.email ? (
                <Button
                  className="h-8 w-8"
                  variant="outline"
                  size="icon"
                  asChild
                >
                  <a href={`mailto:${personal.email}`}>
                    <Envelope className="h-4 w-4" />
                  </a>
                </Button>
              ) : null}
              {personal.phone ? (
                <Button
                  className="h-8 w-8"
                  variant="outline"
                  size="icon"
                  asChild
                >
                  <a href={`tel:${personal.phone}`}>
                    <Phone className="h-4 w-4" />
                  </a>
                </Button>
              ) : null}
              {personal.profiles.map((social) => {
                const Icon = {
                  LinkedIn: LinkedinLogo,
                  GitHub: GithubLogo,
                }[social.network];

                return (
                  <Button
                    key={social.network}
                    className="h-8 w-8"
                    variant="outline"
                    size="icon"
                    asChild
                  >
                    <a href={social.url}>
                      <Icon className="h-4 w-4" />
                    </a>
                  </Button>
                );
              })}
            </div>
            <div className="hidden flex-col gap-x-1 font-mono text-sm text-muted-foreground print:flex">
              {personal.email ? (
                <a href={`mailto:${personal.email}`}>
                  <span className="underline">{personal.email}</span>
                </a>
              ) : null}
              {personal.phone ? (
                <a href={`tel:${personal.phone}`}>
                  <span className="underline">{personal.phone}</span>
                </a>
              ) : null}
            </div>
          </div>

          <Avatar className="h-28 w-28">
            <AvatarImage alt={personal.name} src={personal.avatar} />
            <AvatarFallback>
              {personal.name
                .split(" ")
                .map((name: string) => name[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>
        {personal.summary && (
          <Section>
            <h2 className="text-xl font-bold">About</h2>
            <p className="text-pretty font-mono text-sm text-muted-foreground">
              {personal.summary}
            </p>
          </Section>
        )}
        <Section>
          <h2 className="text-xl font-bold">Work Experience</h2>
          {work.map((work) => {
            return (
              <Card key={work.organization}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-x-2 text-base">
                    <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold leading-none">
                      <a className="hover:underline" href={work.url}>
                        {work.organization}
                      </a>

                      <span className="inline-flex gap-x-1">
                        {work.keywords?.map((keyword) => (
                          <Badge
                            variant="secondary"
                            className="align-middle text-xs"
                            key={keyword}
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </span>
                    </h3>
                    <div className="text-sm tabular-nums text-gray-500">
                      {formatDate(work.startDate)} - {formatDate(work.endDate)}
                    </div>
                  </div>

                  <h4 className="font-mono text-sm leading-none">
                    {work.position}
                  </h4>
                </CardHeader>
                <CardContent className="mt-2 text-xs">
                  <ul>
                    {work.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </Section>
        <Section>
          <h2 className="text-xl font-bold">Education</h2>
          {education.map((education) => {
            return (
              <Card key={education.institution}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-x-2 text-base">
                    <h3 className="font-semibold leading-none">
                      {education.institution}
                    </h3>
                    <div className="text-sm tabular-nums text-gray-500">
                      {formatDate(education.startDate)} -{" "}
                      {formatDate(education.endDate)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="mt-2">
                  {education.studyType} in {education.area}
                </CardContent>
              </Card>
            );
          })}
        </Section>
        <Section>
          <h2 className="text-xl font-bold">Skills</h2>
          <div className="flex flex-wrap gap-1">
            {skills
              .flatMap((skill) => skill.skills)
              .map((skill) => {
                return <Badge key={skill}>{skill}</Badge>;
              })}
          </div>
        </Section>

        {projects && (
          <Section className="print-force-new-page scroll-mb-16">
            <h2 className="text-xl font-bold">Projects</h2>
            <div className="-mx-3 grid grid-cols-1 gap-3 print:grid-cols-3 print:gap-2 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => {
                return (
                  <ProjectCard
                    key={project.name}
                    title={project.name}
                    description={project.highlights.join(" ")}
                    tags={[]}
                    link={"link" in project ? project.url : undefined}
                  />
                );
              })}
            </div>
          </Section>
        )}
      </section>

      <CommandMenu
        links={[
          {
            url: personal.url,
            title: "Personal Website",
          },
          ...personal.profiles.map((profile) => ({
            url: profile.url,
            title: profile.network,
          })),
        ]}
      />
    </main>
  );
}

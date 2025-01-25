import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CommandMenu } from "@/components/command-menu";
import { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project-card";

import { data } from "@/data/resume-data";
import { ExperienceCard } from "@/components/experience-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { SocialIcon } from "@/components/social-icon";
import { Globe, Mail, Phone } from "lucide-react";
const { personal, work, education, affiliations, awards, projects, skills } =
  data;

export const metadata: Metadata = {
  title: `${personal.name} | ${personal.about}`,
  description: personal.summary,
};

export default function Page() {
  return (
    <main className="container relative mx-auto scroll-my-12 overflow-auto p-4 pb-12 md:p-16 print:p-12">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-16 bg-white">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 space-y-1.5">
            <h1 className="text-2xl font-semibold">{personal.name}</h1>
            <p className="text-muted-foreground max-w-md text-pretty text-sm">
              {personal.about}
            </p>
            <p className="text-muted-foreground max-w-md items-center text-pretty text-xs">
              <a
                className="inline-flex gap-x-1.5 align-baseline leading-none hover:underline"
                href={`https://www.google.com/maps/place/${personal.location.city}`}
                target="_blank"
              >
                <Globe className="h-3 w-3" />
                {personal.location.city}, {personal.location.country}
              </a>
            </p>
            <div className="text-muted-foreground flex gap-x-1 pt-1 text-sm print:hidden">
              {personal.email ? (
                <Button
                  className="h-8 w-8"
                  variant="outline"
                  size="icon"
                  asChild
                >
                  <a href={`mailto:${personal.email}`}>
                    <Mail className="h-4 w-4" />
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
              {personal.profiles.map((social) => (
                <Button
                  key={social.network}
                  className="h-8 w-8"
                  variant="outline"
                  size="icon"
                  asChild
                >
                  <a href={social.url}>
                    <SocialIcon social={social.network} className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
            <div className="text-muted-foreground hidden flex-col gap-x-1 font-mono text-sm print:flex">
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
            <h2 className="text-xl">About</h2>
            <p className="text-muted-foreground text-pretty font-mono text-sm">
              {personal.summary}
            </p>
          </Section>
        )}

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

        <Section>
          <h2 className="text-xl">Honors &amp; Awards</h2>
          {awards.map((award) => (
            <Card key={`${award.issuer}${award.title}`}>
              <CardHeader>
                <div className="flex items-center justify-between gap-x-2 text-base">
                  <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold leading-none">
                    <a className="hover:underline" href={award.url}>
                      Issued by {award.issuer}
                    </a>
                  </h3>
                  <div className="text-sm tabular-nums text-gray-500">
                    {formatDate(award.date)}
                  </div>
                </div>

                <h4 className="font-mono text-sm leading-none">
                  {award.title}
                </h4>
              </CardHeader>
              <CardContent className="mt-2 text-xs">
                {!!award?.highlights?.length && (
                  <ul className="list-disc pl-3">
                    {award.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </Section>

        <Section>
          <h2 className="text-xl">Skills</h2>
          <div className="flex flex-wrap gap-1">
            {skills
              .flatMap((skill) => skill.skills)
              .map((skill) => {
                return <Badge key={skill}>{skill}</Badge>;
              })}
          </div>
        </Section>

        {!!projects.length && (
          <Section className="print-force-new-page scroll-mb-16">
            <h2 className="text-xl">Projects</h2>
            <div className="-mx-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-2 print:grid-cols-2 print:gap-2">
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
        )}
      </section>

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

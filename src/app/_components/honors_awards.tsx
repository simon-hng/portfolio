import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Section } from "@/components/ui/section";

import { data } from "@/data/resume-data";
import { formatDate } from "@/lib/utils";
const { awards } = data;

export const HonorsAwards = () => {
  return (
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

            <h4 className="font-mono text-sm leading-none">{award.title}</h4>
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
  );
};

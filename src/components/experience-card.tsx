import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { formatDate } from "@/lib/utils";

interface Props {
  item: {
    organization: string;
    url: string;
    keywords?: string[];
    startDate: Date;
    endDate: Date | "present";
    description: string;
    highlights?: string[];
  };
}

export const ExperienceCard = ({ item }: Props) => (
  <Card key={item.organization}>
    <CardHeader>
      <div className="flex items-center justify-between gap-x-2 text-base">
        <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold leading-none">
          <a className="hover:underline" href={item.url}>
            {item.organization}
          </a>

          <span className="inline-flex gap-x-1">
            {item.keywords?.map((keyword) => (
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
          {formatDate(item.startDate)} - {formatDate(item.endDate)}
        </div>
      </div>

      <h4 className="font-mono text-sm leading-none">{item.description}</h4>
    </CardHeader>
    <CardContent className="mt-2 text-xs">
      {!!item?.highlights?.length && (
        <ul className="list-disc pl-3">
          {item.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      )}
    </CardContent>
  </Card>
);

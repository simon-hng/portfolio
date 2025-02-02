import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "./ui/card";

interface Props {
  title: string;
  description: string;
  link: string;
  tags?: readonly string[];
}

export function ProjectCard({ title, description, link }: Props) {
  return (
    <Card className="border-muted flex flex-col justify-between gap-6 overflow-hidden rounded-xl border px-4 py-3 shadow-sm">
      <div>
        <CardHeader className="">
          <div className="space-y-1">
            <CardTitle className="text-base">
              <a
                href={link}
                target="_blank"
                className="inline-flex gap-1 font-semibold hover:underline"
              >
                {title}
              </a>
            </CardTitle>
            <div className="hidden  text-xs underline">
              {link
                ?.replace("https://", "")
                .replace("www.", "")
                .replace("/", "")}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex">
          <CardDescription className=" text-xs">{description}</CardDescription>
        </CardContent>
      </div>
    </Card>
  );
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SocialIcon } from "@/components/social-icon";
import { Globe, Mail, Phone } from "lucide-react";

import { data } from "@/data/resume-data";
const { personal } = data;

export const Intro = () => {
  return (
    <section className="flex items-center justify-between gap-4">
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
        <div className="text-muted-foreground flex gap-x-1 pt-1 text-sm">
          {personal.email ? (
            <Button className="h-8 w-8" variant="outline" size="icon" asChild>
              <a href={`mailto:${personal.email}`}>
                <Mail className="h-4 w-4" />
              </a>
            </Button>
          ) : null}
          {personal.phone ? (
            <Button className="h-8 w-8" variant="outline" size="icon" asChild>
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
    </section>
  );
};

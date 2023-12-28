import fs from "fs";
import yaml from "js-yaml";

const cvYaml = fs.readFileSync("cv.yml", "utf8");
export const data = yaml.load(cvYaml) as CurriculumVitae;

interface Profile {
  network: "GitHub" | "LinkedIn";
  username: string;
  url: string;
}

interface Location {
  city: string;
  region: string;
  postalCode: number;
  country: string;
}

interface Work {
  organization: string;
  position: string;
  url: string;
  location: string;
  startDate: Date;
  endDate: Date | "present";
  highlights: string[];
  keywords?: string[];
}

interface Education {
  institution: string;
  url?: string;
  area: string;
  studyType: string;
  startDate: Date;
  endDate: Date;
  location: string;
  honors: string[];
  courses: string[];
  highlights: string[];
}

interface Affiliation {
  organization: string;
  position: string;
  location: string;
  url?: string;
  startDate: Date;
  endDate: Date;
  highlights: string[];
}

interface Award {
  title: string;
  date: string;
  issuer: string;
  url?: string;
  location: string;
  highlights: string[];
}

interface Certificate {
  name: string;
  date: string;
  issuer: string;
  url: string;
}

interface Publication {
  name: string;
  publisher: string;
  releaseDate: Date;
  url: string;
}

interface Project {
  name: string;
  url: string;
  affiliation: string;
  startDate: Date;
  endDate: Date;
  highlights: string[];
}

interface Skill {
  category: string;
  skills: string[];
}

interface Language {
  language: string;
  fluency: string;
}

interface Interest {
  interests: string[];
}

interface Reference {
  name: string;
  reference: string;
  url: string;
}

interface CurriculumVitae {
  personal: {
    avatar: string;
    name: string;
    email: string;
    phone: string;
    url: string;
    location: Location;
    profiles: Profile[];
    summary: string;
    about?: string;
  };
  work: Work[];
  education: Education[];
  affiliations: Affiliation[];
  awards: Award[];
  certificates: Certificate[];
  publications: Publication[];
  projects?: Project[];
  keywords?: string[];
  skills: Skill[];
  languages: Language[];
  interests: Interest;
  references: Reference[];
}

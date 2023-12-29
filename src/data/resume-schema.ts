export interface Profile {
  network: "GitHub" | "LinkedIn" | "LeetCode";
  username: string;
  /**
   * @TJS-format uri
   */
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
  /**
   * @TJS-format uri
   */
  url: string;
  location: string;
  startDate: Date;
  endDate: Date | "present";
  highlights: string[];
  keywords?: string[];
}

interface Education {
  institution: string;
  /**
   * @TJS-format uri
   */
  url: string;
  area: string;
  studyType: string;
  startDate: Date;
  endDate: Date | "present";
  location: string;
  honors: string[];
  courses: string[];
  highlights?: string[];
}

interface Affiliation {
  organization: string;
  position: string;
  location: string;
  /**
   * @TJS-format uri
   */
  url: string;
  startDate: Date;
  endDate: Date | "present";
  highlights: string[];
}

interface Award {
  title: string;
  date: Date;
  issuer: string;
  /**
   * @TJS-format uri
   */
  url?: string;
  location: string;
  highlights: string[];
}

interface Certificate {
  name: string;
  date: Date;
  issuer: string;
  /**
   * @TJS-format uri
   */
  url: string;
}

interface Publication {
  name: string;
  publisher: string;
  releaseDate: Date;
  /**
   * @TJS-format uri
   */
  url: string;
}

interface Project {
  name: string;
  /**
   * @TJS-format uri
   */
  url: string;
  affiliation: string;
  startDate: Date;
  endDate: Date | "present";
  highlights: string[];
  keywords?: string[];
}

interface Skill {
  category: string;
  skills: string[];
}

interface Language {
  language: string;
  fluency: string;
}

interface Reference {
  name: string;
  reference: string;
  /**
   * @TJS-format uri
   */
  url: string;
}

export interface CurriculumVitae {
  personal: {
    avatar: string;
    name: string;
    email: string;
    phone?: string;
    /**
     * @TJS-format uri
     */
    url: string;
    location: Location;
    profiles: Profile[];
    about: string;
    summary?: string;
  };
  work: Work[];
  education: Education[];
  affiliations: Affiliation[];
  awards: Award[];
  certificates: Certificate[];
  publications: Publication[];
  projects: Project[];
  skills: Skill[];
  languages: Language[];
  interests: string[];
  references: Reference[];
}

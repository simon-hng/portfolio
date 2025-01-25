import { Profile } from "@/data/resume-schema";
import { Code, Github, Linkedin } from "lucide-react";

interface Props {
  social: Profile["network"];
  className?: string;
}

export const SocialIcon = ({ social, className }: Props) => {
  const Icon = {
    LinkedIn: Linkedin,
    GitHub: Github,
    LeetCode: Code,
  }[social];

  return <Icon className={className} />;
};

import { Profile } from "@/data/resume-schema";
import { Code, GithubLogo, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";

interface Props {
  social: Profile["network"];
  className?: string;
}

export const SocialIcon = ({ social, className }: Props) => {
  const Icon = {
    LinkedIn: LinkedinLogo,
    GitHub: GithubLogo,
    LeetCode: Code,
  }[social];

  return <Icon className={className} />;
};

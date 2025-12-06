import { Metadata } from "next";
import { data } from "@/data/resume-data";
import { Terminal } from "@/components/terminal/terminal";
import { AsciiBackground } from "@/components/ascii-background";

const { personal } = data;

export const metadata: Metadata = {
  title: `${personal.name} | ${personal.about}`,
  description: personal.summary,
};

export default function Page() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <AsciiBackground />
      <Terminal data={data} />
    </main>
  );
}

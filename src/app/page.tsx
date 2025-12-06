import { Metadata } from "next";
import { data } from "@/data/resume-data";
import { Terminal } from "@/components/terminal/terminal";
import { AsciiBackground } from "@/components/ascii-background";
import { GamePortfolio } from "@/components/game";

const { personal } = data;

export const metadata: Metadata = {
  title: `${personal.name} | ${personal.about}`,
  description: personal.summary,
};

export default function Page() {
  return (
    <>
      {/* Desktop: Terminal view */}
      <main className="hidden md:block relative min-h-screen bg-background text-foreground">
        <AsciiBackground />
        <Terminal data={data} />
      </main>

      {/* Mobile: 8-bit Game view */}
      <main className="block md:hidden">
        <GamePortfolio data={data} />
      </main>
    </>
  );
}

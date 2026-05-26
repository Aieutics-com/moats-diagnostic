import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-background)]">
      <header className="px-6 py-6 md:px-12">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Image
            src="/aieutics_transparentbg_logo.png"
            alt="Aieutics"
            width={80}
            height={80}
            className="h-20 w-auto"
          />
          <span className="font-[family-name:var(--font-body)] text-sm text-[var(--color-grey)] italic hidden sm:inline">
            See further. Think deeper. Break through.
          </span>
        </div>
      </header>

      <section className="flex-1 flex items-center justify-center px-6 py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-text-focus-in">
            8 Moats
            <br />
            <span className="text-[var(--color-orange)]">Diagnostic</span>
          </h1>

          <p className="font-[family-name:var(--font-body)] text-lg md:text-xl text-[var(--color-foreground)] leading-relaxed mb-4">
            Surface the gap between claimed and evidenced defensibility.
          </p>
          <p className="font-[family-name:var(--font-body)] text-base text-[var(--color-grey)] leading-relaxed mb-8 max-w-xl mx-auto">
            A claim-and-evidence diagnostic across Gokul Rajaram&apos;s 8 Moats — data, workflow, regulatory, distribution, ecosystem, network, physical infrastructure, scale. Built for founders self-assessing and analysts triaging.
          </p>

          <Link
            href="/diagnostic"
            className="inline-block bg-[var(--color-orange)] text-white font-[family-name:var(--font-heading)] font-bold text-lg px-12 py-4 rounded-xl shadow-[0_0_20px_rgba(255,95,31,0.2)] hover:shadow-[0_0_40px_rgba(255,95,31,0.3)] hover:scale-[1.02] transition-all duration-300"
          >
            Start the Diagnostic
          </Link>
          <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-grey)] mt-4">
            v0.1: claim capture. v0.2 adds evidence probe, verdicts, radar.
          </p>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
            {[
              { n: "1", label: "Data" },
              { n: "2", label: "Workflow" },
              { n: "3", label: "Regulatory" },
              { n: "4", label: "Distribution" },
              { n: "5", label: "Ecosystem" },
              { n: "6", label: "Network" },
              { n: "7", label: "Physical" },
              { n: "8", label: "Scale" },
            ].map((m) => (
              <div
                key={m.n}
                className="border border-[var(--color-grey-light)] rounded-xl p-3 bg-[var(--color-white)]"
              >
                <p className="font-[family-name:var(--font-mono)] text-xs font-bold text-[var(--color-orange)]">
                  {m.n}
                </p>
                <p className="font-[family-name:var(--font-heading)] text-sm font-bold">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-6 py-6 border-t border-[var(--color-grey-light)]">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--color-grey)]">
            Built by{" "}
            <a
              href="https://www.aieutics.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-orange)] transition-colors"
            >
              Aieutics
            </a>
            . Framework after Gokul Rajaram (20VC, 16 March 2026).
          </p>
        </div>
      </footer>
    </main>
  );
}

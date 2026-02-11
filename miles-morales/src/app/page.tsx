import dynamic from "next/dynamic";

const Preloader = dynamic(() => import("@/components/Preloader"), {
  ssr: false,
});
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false,
});
const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"), {
  ssr: false,
});
const Navigation = dynamic(() => import("@/components/Navigation"), {
  ssr: false,
});
const HeroSection = dynamic(
  () => import("@/components/sections/HeroSection"),
  { ssr: false }
);
const AboutSection = dynamic(
  () => import("@/components/sections/AboutSection"),
  { ssr: false }
);
const SuitsSection = dynamic(
  () => import("@/components/sections/SuitsSection"),
  { ssr: false }
);
const PowersSection = dynamic(
  () => import("@/components/sections/PowersSection"),
  { ssr: false }
);
const TimelineSection = dynamic(
  () => import("@/components/sections/TimelineSection"),
  { ssr: false }
);
const MediaSection = dynamic(
  () => import("@/components/sections/MediaSection"),
  { ssr: false }
);
const Footer = dynamic(() => import("@/components/sections/Footer"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Preloader />
      <CustomCursor />
      <SmoothScroll>
        <Navigation />
        <main>
          <HeroSection />
          <AboutSection />
          <SuitsSection />
          <PowersSection />
          <TimelineSection />
          <MediaSection />
        </main>
        <Footer />
      </SmoothScroll>
    </>
  );
}
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}

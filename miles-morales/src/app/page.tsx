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

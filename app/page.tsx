import Navbar, {
  BrandLogo,
  type NavItem,
  type NavbarAction,
} from "@/components/navbar/Navbar";
import Hero from "@/components/hero/Hero";
import AboutSection from "@/components/about/AboutSection";
import RecentEventsSection, {
  type EventSlideItem,
} from "@/components/events/RecentEventsSection";
import QuoteManifestoSection from "@/components/manifesto/QuoteManifestoSection";
import type { CursorFrameItem } from "@/components/ui/CursorImageFrame";

const FLEET_INSTAGRAM_URL = "https://www.instagram.com/fleet.pune/";

const NAV_ITEMS: NavItem[] = [
  { label: "ABOUT", href: "#about" },
  { label: "RUNS", href: "#runs" },
  { label: "COMMUNITY", href: FLEET_INSTAGRAM_URL, external: true },
];

const NAV_ACTION: NavbarAction = {
  label: "JOIN US",
  href: FLEET_INSTAGRAM_URL,
  showIndicator: true,
  external: true,
};

/**
 * Media frames cycled inside the cursor-following hero frame.
 * Supports `videoSrc` (.mp4/.webm looping muted with zero controls)
 * and `imageSrc` (.gif, .jpg, .png, .webp, .avif).
 */
const HERO_FRAMES: CursorFrameItem[] = [
  {
    id: "fleet-video-1",
    alt: "Runners in motion across the city",
    videoSrc:
      "https://assets.mixkit.co/videos/preview/mixkit-man-running-in-the-street-at-sunrise-40839-large.mp4",
    posterSrc:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "fleet-frame-2",
    alt: "Runners in motion on city streets",
    imageSrc:
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "fleet-video-2",
    alt: "Pace crew running on track",
    videoSrc:
      "https://assets.mixkit.co/videos/preview/mixkit-woman-running-above-the-camera-on-a-running-track-32807-large.mp4",
    posterSrc:
      "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "fleet-frame-4",
    alt: "Urban pace crew running together",
    imageSrc:
      "https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "fleet-frame-5",
    alt: "Post-run coffee and social club",
    imageSrc:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
  },
];

/**
 * Last 3 recent Fleet Pune events displayed in the scroll-peeling stack.
 */
const RECENT_EVENTS: EventSlideItem[] = [
  {
    id: "kalyani-nagar-sunrise",
    title: "KALYANI NAGAR 5K",
    subtitle: "SUNDAY SUNRISE SESSION · PUNE",
    frameColor: "#fee897",
    imageSrc:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1400&q=85",
    href: FLEET_INSTAGRAM_URL,
    cursorText: "VIEW EVENT →",
  },
  {
    id: "koregaon-coffee-rave",
    title: "KP COFFEE RUN",
    subtitle: "5K PACE + SPECIALTY BREW HANGOUT",
    frameColor: "#0038ff",
    imageSrc:
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1400&q=85",
    href: FLEET_INSTAGRAM_URL,
    cursorText: "VIEW EVENT →",
  },
  {
    id: "fc-road-night-miles",
    title: "MIDNIGHT MILES",
    subtitle: "CITY LIGHTS 7K · FC ROAD TO BANER",
    frameColor: "#f45034",
    imageSrc:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1400&q=85",
    href: FLEET_INSTAGRAM_URL,
    cursorText: "VIEW EVENT →",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f3f3f1]">
      <Navbar
        brand={<BrandLogo text="Fleet Pune" />}
        items={NAV_ITEMS}
        action={NAV_ACTION}
      />
      <main className="flex-1 flex flex-col">
        <Hero
          subtitleLines={["Start anywhere,", "celebrate together"]}
          headlineBold="PUTS PUNE"
          headlineLight="CREW IN"
          headlineSerif="MOVEMENT"
          frames={HERO_FRAMES}
          cta={{
            label: "Join the fleet",
            href: "#about",
            external: false,
          }}
        />

        <AboutSection
          id="about"
          eyebrow="Who we are"
          headingSans="THE RUNNERS OF"
          headingSerif="FLEET PUNE"
          descriptionLines={[
            "No pressure, no pace gatekeeping. We are",
            "a Pune run club built on movement and coffee.",
            "Show up once, before you even overthink it.",
          ]}
          cta={{
            label: "MORE ABOUT US",
            href: FLEET_INSTAGRAM_URL,
            external: true,
          }}
        />

        <RecentEventsSection
          id="runs"
          eyebrowLines={[
            "Not to be missed, made to be shared.",
            "A glimpse into our recent runs.",
          ]}
          headingSans="RECENT"
          headingSerif="EVENTS"
          events={RECENT_EVENTS}
          cta={{
            label: "VIEW ALL EVENTS",
            href: FLEET_INSTAGRAM_URL,
            external: true,
            bgColor: "#f472c4",
            textColor: "#111111",
          }}
        />

        <QuoteManifestoSection
          id="manifesto"
          quoteLines={[
            "WE WANT PUNE TO",
            "REMEMBER US FOR",
            "MORE THAN MILES",
          ]}
          subtitleLines={[
            "More than paces, more than distance, more than the run itself.",
            "Writing a story that outlasts every Sunday, every season, every era.",
          ]}
        />
      </main>
    </div>
  );
}

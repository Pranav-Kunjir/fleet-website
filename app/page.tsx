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
import Footer from "@/components/footer/Footer";
import PageThemeCanvas from "@/components/ui/PageThemeCanvas";
import type { CursorFrameItem } from "@/components/ui/CursorImageFrame";

const FLEET_WHATSAPP_URL = "https://chat.whatsapp.com/JjWiqqEtATd4FxIgWjf61k";
const FLEET_AROUNDU_URL = "https://aroundu.in/club/fleet-pune";
const FLEET_INSTAGRAM_URL = "https://www.instagram.com/fleet.pune/";

const NAV_ITEMS: NavItem[] = [
  { label: "ABOUT", href: "#about" },
  { label: "EVENTS", href: "#runs" },
  { label: "MANIFESTO", href: "#manifesto" },
  { label: "AROUNDU", href: FLEET_AROUNDU_URL, external: true },
];

const NAV_ACTION: NavbarAction = {
  label: "JOIN WHATSAPP",
  href: FLEET_WHATSAPP_URL,
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
    alt: "7 AM 3K community run",
    imageSrc:
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "fleet-video-2",
    alt: "Pace crew running together",
    videoSrc:
      "https://assets.mixkit.co/videos/preview/mixkit-woman-running-above-the-camera-on-a-running-track-32807-large.mp4",
    posterSrc:
      "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "fleet-frame-4",
    alt: "Football and turf sports community in Pune",
    imageSrc:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "fleet-frame-5",
    alt: "Weekend cricket and social meetup",
    imageSrc:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
  },
];

/**
 * Last 3 recent Fleet Pune events displayed in the scroll-peeling stack.
 */
const RECENT_EVENTS: EventSlideItem[] = [
  {
    id: "kp-inaugural-3k-run",
    title: "KP 3K RUN · WAGHISKAR GARDEN",
    subtitle: "1ST NOVEMBER · 7:00 AM · KOREGAON PARK",
    frameColor: "#FF4438",
    imageSrc:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1400&q=85",
    href: FLEET_AROUNDU_URL,
    cursorText: "JOIN ON AROUNDU →",
  },
  {
    id: "weekend-turf-football",
    title: "WEEKEND TURF FOOTBALL",
    subtitle: "BEYOND SPORTS · PUNE 5V5 & 7V7 SESSIONS",
    frameColor: "#F5F3EF",
    imageSrc:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1400&q=85",
    href: FLEET_WHATSAPP_URL,
    cursorText: "JOIN WHATSAPP →",
  },
  {
    id: "sunday-box-cricket-social",
    title: "BOX CRICKET & COFFEE",
    subtitle: "COME ALONE OR WITH A FRIEND · PUNE",
    frameColor: "#fee897",
    imageSrc:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1400&q=85",
    href: FLEET_INSTAGRAM_URL,
    cursorText: "VIEW ON IG →",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Single continuous background canvas: Light (#f3f3f1) for Sections 1-2, Dark (#0d0a12) for Sections 3-4 + Footer */}
      <PageThemeCanvas darkTriggerId="runs" />

      <Navbar
        brand={<BrandLogo />}
        items={NAV_ITEMS}
        action={NAV_ACTION}
      />

      <main className="relative z-10 flex-1 flex flex-col">
        <Hero
          subtitleLines={[
            "Filling your weekend plan holes —",
            "Running, football, cricket & community",
          ]}
          headlineBold="PUTS PUNE"
          headlineLight="SPORTS IN"
          headlineSerif="MOVEMENT"
          frames={HERO_FRAMES}
          cta={{
            label: "Show up with Fleet",
            href: "#about",
            external: false,
          }}
        />

        <AboutSection
          id="about"
          eyebrow="Why we started Fleet"
          headingSans="BEYOND SPORTS AT"
          headingSerif="FLEET PUNE"
          descriptionLines={[
            "We all have a sport we grew up playing — then life happens,",
            "and you stop finding the people to play that sport with.",
            "Fleet is Pune's sporting community scaling across running, football & cricket.",
            "Come alone or with a friend — showing up might create a lifetime of memories.",
          ]}
          cta={{
            label: "JOIN WHATSAPP CREW",
            href: FLEET_WHATSAPP_URL,
            external: true,
            bgColor: "#FF4438",
            textColor: "#ffffff",
          }}
          secondaryCta={{
            label: "CLUB ON AROUNDU",
            href: FLEET_AROUNDU_URL,
            external: true,
            bgColor: "#111111",
            textColor: "#ffffff",
          }}
        />

        <RecentEventsSection
          id="runs"
          eyebrowLines={[
            "Come alone or with a friend, leave with a lot of memories.",
            "From early morning 3K runs to multi-sport weekends across Pune.",
          ]}
          headingSans="RECENT"
          headingSerif="EVENTS"
          events={RECENT_EVENTS}
          cta={{
            label: "EXPLORE ON AROUNDU",
            href: FLEET_AROUNDU_URL,
            external: true,
            bgColor: "#FF4438",
            textColor: "#ffffff",
          }}
        />

        <QuoteManifestoSection
          id="manifesto"
          quoteLines={[
            "SHOW UP ONCE",
            "CREATE A LIFETIME",
            "OF MEMORIES",
          ]}
          subtitleLines={[
            "We all have a sport we grew up playing — before life happened.",
            "Running, football, cricket & weekend plans across Pune worth waking up for.",
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}

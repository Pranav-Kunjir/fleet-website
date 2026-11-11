import InteractiveCollage, {
  type InteractiveCollageProps,
} from "@/components/about/InteractiveCollage";
import SlideArrowButton, {
  type SlideArrowButtonProps,
} from "@/components/ui/SlideArrowButton";

export interface AboutSectionProps {
  id?: string;
  eyebrow?: string;
  headingSans?: string;
  headingSerif?: string;
  descriptionLines?: string[];
  collage?: InteractiveCollageProps;
  cta?: SlideArrowButtonProps;
}

export default function AboutSection({
  id = "about",
  eyebrow = "Who we are",
  headingSans = "THE RUNNERS OF",
  headingSerif = "FLEET PUNE",
  descriptionLines = [
    "No pressure, no pace gatekeeping. We are",
    "a Pune run club built on movement and coffee.",
    "Show up once, before you even overthink it.",
  ],
  collage,
  cta,
}: AboutSectionProps) {
  return (
    <section
      id={id}
      className="w-full py-20 md:py-28 px-5 sm:px-8 lg:px-12 bg-[#f3f3f1] overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Interactive Polaroid & Sticker Collage */}
        <div className="lg:col-span-6 w-full">
          <InteractiveCollage {...collage} />
        </div>

        {/* Right Column: Editorial Typography & Split Blue Action Button */}
        <div className="lg:col-span-6 flex flex-col items-center text-center px-2 sm:px-6">
          {/* Serif Eyebrow */}
          <p className="font-serif text-[26px] sm:text-[32px] md:text-[36px] leading-none tracking-[-0.015em] text-[#111111] mb-3">
            {eyebrow}
          </p>

          {/* Two-line Mixed Sans + Serif Heading */}
          <h2 className="flex flex-col items-center text-[#0b0b0b]">
            <span className="font-sans font-black uppercase text-[9.5vw] sm:text-[54px] lg:text-[62px] xl:text-[74px] leading-[0.88] tracking-[-0.045em] whitespace-nowrap">
              {headingSans}
            </span>
            <span className="font-serif font-normal uppercase text-[10.4vw] sm:text-[60px] lg:text-[70px] xl:text-[82px] leading-[0.86] tracking-[-0.025em] mt-0.5 whitespace-nowrap">
              {headingSerif}
            </span>
          </h2>

          {/* Centered Body Paragraph */}
          <p className="font-sans text-[14.5px] sm:text-[15.5px] leading-[1.55] tracking-[-0.01em] text-[#1a1a1a] max-w-[430px] mt-5 mb-7">
            {descriptionLines.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </p>

          {/* Royal Blue Split Arrow Button */}
          <SlideArrowButton {...cta} />
        </div>
      </div>
    </section>
  );
}

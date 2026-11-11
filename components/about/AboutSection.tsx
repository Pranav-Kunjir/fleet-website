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
  secondaryCta?: SlideArrowButtonProps;
}

export default function AboutSection({
  id = "about",
  eyebrow = "Why we started Fleet",
  headingSans = "BEYOND SPORTS AT",
  headingSerif = "FLEET PUNE",
  descriptionLines = [
    "We all have a sport we grew up playing — then life happens,",
    "and you stop finding the people to play that sport with.",
    "Fleet is here to fix your weekend plan holes across running, football & cricket.",
    "Come alone or with a friend — showing up might create a lifetime of memories.",
  ],
  collage,
  cta,
  secondaryCta,
}: AboutSectionProps) {
  return (
    <section
      id={id}
      className="relative w-full py-16 sm:py-24 md:py-32 px-4 sm:px-8 lg:px-12 bg-transparent text-[#111111] overflow-x-clip"
    >
      <div className="relative z-10 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-8 items-center">
        {/* Left Column: Interactive Polaroid & Sticker Collage */}
        <div className="lg:col-span-6 w-full">
          <InteractiveCollage {...collage} />
        </div>

        {/* Right Column: Editorial Typography & Split Coral-Red Action Button */}
        <div className="lg:col-span-6 flex flex-col items-center text-center px-1 sm:px-6">
          {/* Serif Eyebrow */}
          <p className="font-serif text-[23px] sm:text-[32px] md:text-[36px] leading-none tracking-[-0.015em] text-[#111111] mb-2.5 sm:mb-3">
            {eyebrow}
          </p>

          {/* Two-line Mixed Sans + Serif Heading */}
          <h2 className="flex flex-col items-center text-[#0b0b0b] max-w-full">
            <span className="font-sans font-black uppercase text-[8.8vw] sm:text-[54px] lg:text-[62px] xl:text-[74px] leading-[0.9] sm:leading-[0.88] tracking-[-0.045em] whitespace-nowrap">
              {headingSans}
            </span>
            <span className="font-serif font-normal uppercase text-[11vw] sm:text-[60px] lg:text-[70px] xl:text-[82px] leading-[0.88] sm:leading-[0.86] tracking-[-0.025em] mt-0.5 whitespace-nowrap">
              {headingSerif}
            </span>
          </h2>

          {/* Centered Body Paragraph */}
          <p className="font-sans text-[14px] sm:text-[15.5px] leading-[1.6] tracking-[-0.01em] text-[#1a1a1a] max-w-[340px] sm:max-w-[480px] mt-4 sm:mt-5 mb-6 sm:mb-7">
            {descriptionLines.map((line, index) => (
              <span key={index} className="inline sm:block">
                {line}
                {index < descriptionLines.length - 1 ? " " : ""}
              </span>
            ))}
          </p>

          {/* Action Buttons (WhatsApp + AroundU) */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-3.5 w-full sm:w-auto">
            <SlideArrowButton {...cta} />
            {secondaryCta && <SlideArrowButton {...secondaryCta} />}
          </div>
        </div>
      </div>
    </section>
  );
}

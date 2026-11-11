"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

export interface CursorFrameItem {
  id: string;
  alt: string;
  /** Supports static images (.jpg, .png, .avif, .webp) AND animated GIFs (.gif) */
  imageSrc?: string;
  /** Supports looping background videos (.mp4, .webm, .mov) rendered without controls */
  videoSrc?: string;
  /** Optional poster image for video frames */
  posterSrc?: string;
  /** Optional custom React element */
  render?: ReactNode;
}

export interface CursorImageFrameProps {
  /** Container element that tracks cursor movement */
  containerRef: RefObject<HTMLElement | null>;
  /** Frames (images, GIFs, or videos) cycled through as the cursor moves */
  frames?: CursorFrameItem[];
  /** Accumulated cursor movement distance before switching to the next frame */
  threshold?: number;
  /** Minimum time (in ms) each frame stays on screen before it can switch */
  minFrameDurationMs?: number;
  /** How far the frame travels relative to the cursor (0.65 = weighted tether, 1 = full range) */
  followStrength?: number;
  /** Selector for interactive elements that temporarily hide the floating card */
  blockSelector?: string;
  /** Optional extra classes for the card container */
  className?: string;
}

const VIDEO_EXTENSION_REGEX = /\.(mp4|webm|ogg|mov)(\?.*)?$/i;

/**
 * Default set of visual frames (including control-less looping videos, GIFs, and photos)
 * for Fleet Pune (@fleet.pune) that cycle as the user moves their cursor across the hero.
 */
export const DEFAULT_FLEET_FRAMES: CursorFrameItem[] = [
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
    alt: "Fleet Pune morning group run",
    imageSrc:
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "fleet-video-2",
    alt: "Sprinting pace crew",
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

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

export default function CursorImageFrame({
  containerRef,
  frames = DEFAULT_FLEET_FRAMES,
  threshold = 220,
  minFrameDurationMs = 350,
  followStrength = 0.72,
  blockSelector = "a, button, [data-cursor-cards-block]",
  className = "",
}: CursorImageFrameProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mediasRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Ensure the active frame's video plays seamlessly with no controls
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === activeIndex) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeIndex]);

  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    const medias = mediasRef.current;
    if (!container || !card || !medias || frames.length === 0) return;

    const state = {
      currentX: 0,
      currentY: 0,
      lazyTargetX: 0,
      lazyTargetY: 0,
      targetX: 0,
      targetY: 0,
      vx: 0,
      vy: 0,
      currentRot: 0,
      vRot: 0,
      currentInnerX: 0,
      currentInnerY: 0,
      currentOpacity: 0,
      targetOpacity: 0,
      currentScale: 0.84,
      targetScale: 0.84,
      lastClientX: 0,
      lastClientY: 0,
      accumulatedDist: 0,
      lastSwitchTime: performance.now(),
      hasMoved: false,
      isBlocked: false,
      frameCounter: 0,
    };

    // Heavy mass + slow inertia constants so the frame moves slowly with physical weight
    const LAZY_ANCHOR_LERP = 0.55;
    const POS_STIFFNESS = 0.018;
    const POS_DAMPING = 0.86;
    const ROT_STIFFNESS = 0.045;
    const ROT_DAMPING = 0.82;

    let rafId: number | null = null;

    const animate = () => {
      // Stage 1: Slow-trailing target anchor
      state.lazyTargetX +=
        (state.targetX - state.lazyTargetX) * LAZY_ANCHOR_LERP;
      state.lazyTargetY +=
        (state.targetY - state.lazyTargetY) * LAZY_ANCHOR_LERP;

      // Stage 2: Heavy spring-mass body pulled toward the lazy anchor
      const ax = (state.lazyTargetX - state.currentX) * POS_STIFFNESS;
      const ay = (state.lazyTargetY - state.currentY) * POS_STIFFNESS;
      state.vx = (state.vx + ax) * POS_DAMPING;
      state.vy = (state.vy + ay) * POS_DAMPING;
      state.currentX += state.vx;
      state.currentY += state.vy;

      // Smooth rotational tilt driven by the heavy body's horizontal momentum
      const targetRot = clamp(state.vx * 0.95, -14, 14);
      const aRot = (targetRot - state.currentRot) * ROT_STIFFNESS;
      state.vRot = (state.vRot + aRot) * ROT_DAMPING;
      state.currentRot += state.vRot;

      // Inner media counter-parallax driven by momentum
      const targetInnerX = clamp(-state.vx * 0.65, -10, 10);
      const targetInnerY = clamp(-state.vy * 0.65, -10, 10);
      state.currentInnerX += (targetInnerX - state.currentInnerX) * 0.07;
      state.currentInnerY += (targetInnerY - state.currentInnerY) * 0.07;

      // Opacity & scale fade in/out when entering or leaving the hero frame
      state.currentOpacity += (state.targetOpacity - state.currentOpacity) * 0.1;
      state.currentScale += (state.targetScale - state.currentScale) * 0.1;

      card.style.transform = `translate3d(${state.currentX.toFixed(2)}px, ${state.currentY.toFixed(2)}px, 0) rotate(${state.currentRot.toFixed(2)}deg) scale(${state.currentScale.toFixed(3)})`;
      card.style.opacity = state.currentOpacity.toFixed(3);
      medias.style.transform = `translate3d(${state.currentInnerX.toFixed(2)}%, ${state.currentInnerY.toFixed(2)}%, 0) scale(1.18)`;

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    const handlePointerMove = (e: PointerEvent | MouseEvent) => {
      const { clientX, clientY, target } = e;
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Apply followStrength so the frame stays weighted and does not stick 1:1 to cursor
      const weightedX = (clientX - centerX) * followStrength;
      const weightedY = (clientY - centerY) * followStrength;

      // Hide floating frame when hovering interactive buttons/links
      if (target instanceof Element && target.closest(blockSelector)) {
        if (!state.isBlocked) {
          state.isBlocked = true;
          state.targetOpacity = 0;
          state.targetScale = 0.88;
        }
        state.targetX = weightedX;
        state.targetY = weightedY;
        state.lastClientX = clientX;
        state.lastClientY = clientY;
        return;
      }

      if (state.isBlocked) {
        state.isBlocked = false;
        state.targetOpacity = 1;
        state.targetScale = 1;
      }

      // On first entry into the hero, start slightly behind the cursor for a weighted reveal
      if (!state.hasMoved) {
        state.hasMoved = true;
        state.currentX = weightedX * 0.75;
        state.currentY = weightedY * 0.75;
        state.lazyTargetX = weightedX * 0.85;
        state.lazyTargetY = weightedY * 0.85;
        state.vx = 0;
        state.vy = 0;
        state.lastClientX = clientX;
        state.lastClientY = clientY;
        state.targetOpacity = 1;
        state.targetScale = 1;
      }

      const dx = (clientX - state.lastClientX) / 2;
      const dy = (clientY - state.lastClientY) / 2;

      state.targetX = weightedX;
      state.targetY = weightedY;

      state.lastClientX = clientX;
      state.lastClientY = clientY;

      // Accumulate cursor travel distance and advance frame only when both
      // the distance threshold AND minimum dwell duration have elapsed
      state.accumulatedDist += Math.abs(dx) + Math.abs(dy);
      const now = performance.now();
      if (
        state.accumulatedDist > threshold &&
        now - state.lastSwitchTime >= minFrameDurationMs
      ) {
        state.accumulatedDist = 0;
        state.lastSwitchTime = now;
        state.frameCounter = (state.frameCounter + 1) % frames.length;
        setActiveIndex(state.frameCounter);
      }
    };

    const handlePointerLeave = () => {
      state.hasMoved = false;
      state.isBlocked = false;
      state.targetOpacity = 0;
      state.targetScale = 0.84;
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [
    containerRef,
    frames.length,
    threshold,
    minFrameDurationMs,
    followStrength,
    blockSelector,
  ]);

  return (
    <div
      ref={cardRef}
      data-cursor-cards-card=""
      aria-hidden="true"
      style={{ opacity: 0 }}
      className={`pointer-events-none select-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[170px] sm:w-[205px] sm:h-[218px] lg:w-[240px] lg:h-[252px] overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.12)] will-change-transform ${className}`}
    >
      <div
        ref={mediasRef}
        data-cursor-cards-medias=""
        className="relative w-full h-full will-change-transform"
      >
        {frames.map((frame, index) => {
          const isActive = index === activeIndex;
          const resolvedVideoSrc =
            frame.videoSrc ??
            (frame.imageSrc && VIDEO_EXTENSION_REGEX.test(frame.imageSrc)
              ? frame.imageSrc
              : undefined);

          return (
            <div
              key={frame.id}
              data-cursor-cards-media=""
              className={`absolute inset-0 w-full h-full ${
                isActive ? "visible z-10" : "invisible z-0"
              }`}
            >
              {resolvedVideoSrc ? (
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  src={resolvedVideoSrc}
                  poster={frame.posterSrc ?? frame.imageSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls={false}
                  disablePictureInPicture
                  disableRemotePlayback
                  controlsList="nodownload nofullscreen noremoteplayback"
                  tabIndex={-1}
                  className="w-full h-full object-cover pointer-events-none select-none"
                />
              ) : frame.imageSrc ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={frame.imageSrc}
                  alt={frame.alt}
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none select-none"
                />
              ) : (
                frame.render
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

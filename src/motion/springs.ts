import type { Transition, Variants } from "motion/react";

/**
 * One shared motion vocabulary for the whole product.
 * Every animation in Smart Farmer AI pulls its timing from here so that a
 * button press, a card entrance and a screen change all feel like the same hand.
 */

/** Instant, tactile — button presses and chip selection. */
export const press: Transition = { type: "spring", stiffness: 620, damping: 26, mass: 0.6 };

/** The default: confident but calm. Cards, sheets, layout shifts. */
export const gentle: Transition = { type: "spring", stiffness: 260, damping: 28, mass: 0.9 };

/** A little overshoot — success states, badges popping in. */
export const pop: Transition = { type: "spring", stiffness: 420, damping: 18, mass: 0.7 };

/** Long, soft travel for full-screen transitions. */
export const glide: Transition = { type: "spring", stiffness: 210, damping: 30, mass: 1 };

/** Non-spring easing for opacity-only and progress work. */
export const ease: Transition = { duration: 0.32, ease: [0.22, 1, 0.36, 1] };

/** Container that reveals its children one after another. */
export const stagger = (gap = 0.055, delay = 0.04): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

/** The child of a `stagger` container: rises and fades in. */
export const riseItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: gentle },
};

/** Screen-level transition used by the router's AnimatePresence. */
export const screenVariants: Variants = {
  initial: { opacity: 0, y: 14, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1, transition: glide },
  exit: { opacity: 0, y: -10, scale: 0.99, transition: { duration: 0.18 } },
};

/** Shared-layout ids, kept in one place so they never drift apart. */
export const layoutIds = {
  cropPill: "crop-selector-pill",
  navPill: "bottom-nav-pill",
  tabPill: "segment-pill",
} as const;

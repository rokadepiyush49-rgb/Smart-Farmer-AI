import { twMerge } from "tailwind-merge";

/**
 * Joins class names AND resolves Tailwind conflicts.
 *
 * Without the merge, `cn("bg-leaf text-white", "bg-white text-leaf-dark")` keeps
 * both classes and the winner is decided by stylesheet order — which is how a
 * primary button ends up with white text on a white background. twMerge makes
 * the last class win, so component-level overrides behave predictably.
 */
export function cn(...parts: Array<string | false | null | undefined>) {
  return twMerge(parts.filter(Boolean).join(" "));
}

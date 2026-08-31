// ponytail: minimal cn — join truthy class strings. Swap for clsx+tailwind-merge
// only if a component starts needing conflict resolution between Tailwind classes.
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

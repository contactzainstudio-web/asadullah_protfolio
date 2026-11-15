/** Smooth-scroll to a section id (respects prefers-reduced-motion) and update the URL hash. */
export function goTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior: ScrollBehavior = reduce ? "auto" : "smooth";
  if (id === "home") window.scrollTo({ top: 0, behavior });
  else el.scrollIntoView({ behavior, block: "start" });
  history.replaceState(null, "", id === "home" ? window.location.pathname : `#${id}`);
  el.focus({ preventScroll: true });
}

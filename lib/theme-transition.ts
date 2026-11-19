type SetTheme = (theme: string) => void;

let activeTransition: ViewTransition | undefined;

export function setThemeWithTransition(theme: string, setTheme: SetTheme) {
  const updateTheme = () => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    setTheme(theme);
  };

  if (
    typeof document === "undefined" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    typeof document.startViewTransition !== "function"
  ) {
    setTheme(theme);
    return;
  }

  activeTransition?.skipTransition();

  const transition = document.startViewTransition(updateTheme);
  activeTransition = transition;

  const clearTransition = () => {
    if (activeTransition === transition) {
      activeTransition = undefined;
    }
  };

  void transition.finished.then(clearTransition, clearTransition);
}

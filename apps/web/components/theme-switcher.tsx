"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@workspace/ui/components/button";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="h-9 w-9">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-9 w-9"
      onClick={(e) => {
        const root = document.documentElement;
        const next = isDark ? "light" : "dark";

        // Click coordinates for radial reveal
        const x = e.clientX;
        const y = e.clientY;
        root.style.setProperty("--theme-x", `${x}px`);
        root.style.setProperty("--theme-y", `${y}px`);

        // Use View Transitions API if available for a radial background reveal
        const anyDoc = document as unknown as {
          startViewTransition?: (cb: () => void) => { finished: Promise<void> };
        };
        if (anyDoc.startViewTransition) {
          const vt = anyDoc.startViewTransition(() => {
            setTheme(next);
          });
          vt.finished.finally(() => {
            // Cleanup vars just in case
            root.style.removeProperty("--theme-x");
            root.style.removeProperty("--theme-y");
          });
          return;
        }

        // Fallback: smooth CSS transition on colors only
        root.classList.add("color-theme-transition");
        window.setTimeout(() => {
          root.classList.remove("color-theme-transition");
        }, 300);
        setTheme(next);
      }}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? (
        <Sun className="h-4 w-4 transition-all" />
      ) : (
        <Moon className="h-4 w-4 transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

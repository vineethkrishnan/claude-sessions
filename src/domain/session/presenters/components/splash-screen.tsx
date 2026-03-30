import { useState, useEffect } from "react";
import { Text, Box } from "ink";

const LOGO_LINES = [
  "     _                    _   ",
  "    / \\   __ _  ___ _ __ | |_ ",
  "   / _ \\ / _` |/ _ \\ '_ \\| __|",
  "  / ___ \\ (_| |  __/ | | | |_ ",
  " /_/   \\_\\__, |\\___|_| |_|\\__|",
  "         |___/                ",
  "",
  " _____               _                ",
  "/  ___|             (_)               ",
  "\\ `--.  ___  ___ ___ _  ___  _ __  ___",
  " `--. \\/ _ \\/ __/ __| |/ _ \\| '_ \\/ __|",
  "/\\__/ /  __/\\__ \\__ \\ | (_) | | | \\__ \\",
  "\\____/ \\___||___/___/_|\\___/|_| |_|___/",
];

const BANNER_LINES = [
  "##########################################################################################",
  "#                                                                                        #",
  "#                       WELCOME TO AGENT SESSIONS ✨                                     #",
  "#              Browse, search, delete, and resume your AI sessions                        #",
  "#                                                                                        #",
  "##########################################################################################",
];

interface SplashScreenProps {
  version: string;
  loading?: boolean;
}

export function SplashScreen({ version, loading }: SplashScreenProps) {
  const allLines = [...LOGO_LINES, "", ...BANNER_LINES];
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount < allLines.length) {
      const timer = setTimeout(() => setVisibleCount((c) => c + 1), 60);
      return () => clearTimeout(timer);
    }
  }, [visibleCount, allLines.length]);

  return (
    <Box flexDirection="column" paddingTop={1}>
      {allLines.slice(0, visibleCount).map((line, i) => {
        const isLogo = i < LOGO_LINES.length;
        const isBanner = i >= LOGO_LINES.length + 1;
        return (
          <Text key={i} color={isLogo ? "cyan" : isBanner ? "cyan" : undefined} bold={isBanner}>
            {line}
          </Text>
        );
      })}
      {visibleCount >= allLines.length && (
        <Box paddingLeft={1} paddingTop={1}>
          <Text dimColor>
            v{version}
            {loading ? " — Loading sessions..." : ""}
          </Text>
        </Box>
      )}
    </Box>
  );
}

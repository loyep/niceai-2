"use client";

import React, {
  createContext,
  Fragment,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Button, ConfigProvider, Dropdown, Menu } from "@arco-design/web-react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

type ValueObject = Record<string, string>;

interface UseThemeProps {
  /** List of all available theme names */
  themes: string[];
  /** Forced theme name for the current page */
  forcedTheme?: string | undefined;
  /** Update the theme */
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  /** Active theme name */
  theme?: string | undefined;
  /** If `enableSystem` is true and the active theme is "system", this returns whether the system preference resolved to "dark" or "light". Otherwise, identical to `theme` */
  resolvedTheme?: string | undefined;
  /** If enableSystem is true, returns the System theme preference ("dark" or "light"), regardless what the active theme is */
  systemTheme?: "dark" | "light" | undefined;
}

interface ThemeProviderProps {
  /** List of all available theme names */
  themes?: string[] | undefined;
  /** Forced theme name for the current page */
  forcedTheme?: string | undefined;
  /** Whether to switch between dark and light themes based on prefers-color-scheme */
  enableSystem?: boolean | undefined;
  /** Disable all CSS transitions when switching themes */
  disableTransitionOnChange?: boolean | undefined;
  /** Whether to indicate to browsers which color scheme is used (dark or light) for built-in UI like inputs and buttons */
  enableColorScheme?: boolean | undefined;
  /** Key used to store theme setting in localStorage */
  storageKey?: string | undefined;
  /** Default theme name (for v0.0.12 and lower the default was light). If `enableSystem` is false, the default theme is light */
  defaultTheme?: string | undefined;
  /** HTML attribute modified based on the active theme. Accepts `class` and `data-*` (meaning any data attribute, `data-mode`, `data-color`, etc.) */
  attribute?: "class" | undefined;
  /** Mapping of theme name to HTML attribute value. Object where key is the theme name and value is the attribute value */
  value?: ValueObject | undefined;
  /** Nonce string to pass to the inline script for CSP headers */
  nonce?: string | undefined;

  children?: React.ReactNode;
}

const colorSchemes = ["light", "dark"];
const MEDIA = "(prefers-color-scheme: dark)";
const isServer = typeof window === "undefined";
const ThemeContext = createContext<UseThemeProps | undefined>(undefined);
const defaultContext: UseThemeProps = {
  setTheme: (_) => {
    //
  },
  themes: [],
};

export const useTheme = () => useContext(ThemeContext) ?? defaultContext;

export const ThemeProvider: React.FC<ThemeProviderProps> = (props) => {
  const context = useContext(ThemeContext);

  // Ignore nested context providers, just passthrough children
  if (context) return <Fragment>{props.children}</Fragment>;
  return <Theme {...props} />;
};

const defaultThemes = ["light", "dark"];

const Theme: React.FC<ThemeProviderProps> = ({
  forcedTheme,
  disableTransitionOnChange = false,
  enableSystem = true,
  enableColorScheme = true,
  storageKey = "theme",
  themes = defaultThemes,
  defaultTheme = enableSystem ? "system" : "light",
  attribute = "data-theme",
  value,
  children,
  nonce,
}) => {
  const [theme, setThemeState] = useState(() =>
    getTheme(storageKey, defaultTheme),
  );
  const [resolvedTheme, setResolvedTheme] = useState(() =>
    getTheme(storageKey),
  );
  const attrs = !value ? themes : Object.values(value);

  const applyTheme = useCallback(
    (theme: string) => {
      let resolved = theme;
      if (!resolved) return;

      // If theme is system, resolve it before setting theme
      if (theme === "system" && enableSystem) {
        resolved = getSystemTheme();
      }

      const name = value ? value[resolved] : resolved;
      const enable = disableTransitionOnChange ? disableAnimation() : null;
      const d = document.documentElement;
      const a = document.body;

      if (attribute === "class") {
        d.classList.remove(...attrs);

        if (name) d.classList.add(name);
      } else {
        if (name) {
          d.setAttribute(attribute, name);
        } else {
          d.removeAttribute(attribute);
        }
      }
      a.setAttribute("arco-theme", name!);

      if (enableColorScheme) {
        const fallback = colorSchemes.includes(defaultTheme)
          ? defaultTheme
          : null;
        const colorScheme = colorSchemes.includes(resolved)
          ? resolved
          : fallback;
        d.style.colorScheme = colorScheme!;
      }

      enable?.();
    },
    [
      attribute,
      attrs,
      defaultTheme,
      disableTransitionOnChange,
      enableColorScheme,
      enableSystem,
      value,
    ],
  );

  const setTheme = useCallback(
    (themeFn: string | ((t?: string) => string)) => {
      const newTheme = typeof themeFn === "function" ? themeFn(theme) : themeFn;
      setThemeState(newTheme);

      // Save to storage
      try {
        console.log("1111111", newTheme);
        localStorage.setItem(storageKey, newTheme);
      } catch (e) {
        // Unsupported
      }
    },
    [storageKey, theme],
  );

  const handleMediaQuery = useCallback(
    (e: MediaQueryListEvent | MediaQueryList) => {
      const resolved = getSystemTheme(e);
      setResolvedTheme(resolved);

      if (theme === "system" && enableSystem && !forcedTheme) {
        applyTheme("system");
      }
    },
    [theme, enableSystem, forcedTheme, applyTheme],
  );

  // Always listen to System preference
  useEffect(() => {
    const media = window.matchMedia(MEDIA);

    // Intentionally use deprecated listener methods to support iOS & old browsers
    media.addListener(handleMediaQuery);
    handleMediaQuery(media);

    return () => media.removeListener(handleMediaQuery);
  }, [handleMediaQuery]);

  // localStorage event handling
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) {
        return;
      }

      // If default theme set, use it if localstorage === null (happens on local storage manual deletion)
      const theme = e.newValue ?? defaultTheme;
      setTheme(theme);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [defaultTheme, setTheme, storageKey]);

  // Whenever theme or forcedTheme changes, apply it
  useEffect(() => {
    applyTheme(forcedTheme ?? theme!);
  }, [applyTheme, forcedTheme, theme]);

  const providerValue = useMemo(
    () => ({
      theme,
      setTheme,
      forcedTheme,
      resolvedTheme: theme === "system" ? resolvedTheme : theme,
      themes: enableSystem ? [...themes, "system"] : themes,
      systemTheme: (enableSystem ? resolvedTheme : undefined) as
        | "light"
        | "dark"
        | undefined,
    }),
    [theme, setTheme, forcedTheme, resolvedTheme, enableSystem, themes],
  );

  return (
    <ThemeContext.Provider value={providerValue as UseThemeProps}>
      <ThemeScript
        {...{
          forcedTheme,
          disableTransitionOnChange,
          enableSystem,
          enableColorScheme,
          storageKey,
          themes,
          defaultTheme,
          attribute,
          value,
          children,
          attrs,
          nonce,
        }}
      />
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react/display-name, @typescript-eslint/no-explicit-any
const ThemeScript: any = memo(
  ({
    forcedTheme,
    storageKey,
    attribute,
    enableSystem,
    enableColorScheme,
    defaultTheme,
    value,
    attrs,
    nonce,
  }: ThemeProviderProps & { attrs: string[]; defaultTheme: string }) => {
    const defaultSystem = defaultTheme === "system";

    // Code-golfing the amount of characters in the script
    const optimization = (() => {
      if (attribute === "class") {
        const removeClasses = `c.remove(${attrs
          .map((t: string) => `'${t}'`)
          .join(",")})`;

        return `var d=document.documentElement,c=d.classList,a=document.body;${removeClasses};`;
      } else {
        return `var d=document.documentElement,a=document.body,n='${attribute}',s='setAttribute';`;
      }
    })();

    const fallbackColorScheme = (() => {
      if (!enableColorScheme) {
        return "";
      }

      const fallback = colorSchemes.includes(defaultTheme)
        ? defaultTheme
        : null;

      if (fallback) {
        return `if(e==='light'||e==='dark'||!e)d.style.colorScheme=e||'${defaultTheme}'`;
      } else {
        return `if(e==='light'||e==='dark')d.style.colorScheme=e`;
      }
    })();

    const updateDOM = (
      name: string,
      literal = false,
      setColorScheme = true,
    ) => {
      const resolvedName = value ? value[name] : name;
      const val = literal ? name + `|| ''` : `'${resolvedName}'`;
      let text = "";

      // MUCH faster to set colorScheme alongside HTML attribute/class
      // as it only incurs 1 style recalculation rather than 2
      // This can save over 250ms of work for pages with big DOM
      if (
        enableColorScheme &&
        setColorScheme &&
        !literal &&
        colorSchemes.includes(name)
      ) {
        text += `d.style.colorScheme = '${name}';`;
      }

      if (attribute === "class") {
        if (literal || resolvedName) {
          text += `c.add(${val});a.setAttribute('arco-theme', ${val})`;
        } else {
          text += `a.setAttribute('arco-theme', ${val || "light"})`;
        }
      } else {
        if (resolvedName) {
          text += `d[s](n,${val})`;
        }
      }

      return text;
    };

    const scriptSrc = (() => {
      if (forcedTheme) {
        return `!function(){${optimization}${updateDOM(forcedTheme)}}()`;
      }

      if (enableSystem) {
        return `!function(){try{${optimization}var e=localStorage.getItem('${storageKey}');if('system'===e||(!e&&${defaultSystem})){var t='${MEDIA}',m=window.matchMedia(t);if(m.media!==t||m.matches){${updateDOM(
          "dark",
        )}}else{${updateDOM("light")}}}else if(e){${
          value ? `var x=${JSON.stringify(value)};` : ""
        }${updateDOM(value ? `x[e]` : "e", true)}}${
          !defaultSystem
            ? `else{` + updateDOM(defaultTheme, false, false) + "}"
            : ""
        }${fallbackColorScheme}}catch(e){}}()`;
      }

      return `!function(){try{${optimization}var e=localStorage.getItem('${storageKey}');if(e){${
        value ? `var x=${JSON.stringify(value)};` : ""
      }${updateDOM(value ? `x[e]` : "e", true)}}else{${updateDOM(
        defaultTheme,
        false,
        false,
      )};}${fallbackColorScheme}}catch(t){}}();`;
    })();

    return (
      <script nonce={nonce} dangerouslySetInnerHTML={{ __html: scriptSrc }} />
    );
  },
  // Never re-render this component
  () => true,
);

// Helpers
const getTheme = (key: string, fallback?: string) => {
  if (isServer) return undefined;
  let theme;
  try {
    theme = localStorage.getItem(key) ?? undefined;
  } catch (e) {
    // Unsupported
  }
  return theme ?? fallback;
};

const disableAnimation = () => {
  const css = document.createElement("style");
  css.appendChild(
    document.createTextNode(
      `*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`,
    ),
  );
  document.head.appendChild(css);

  return () => {
    // Force restyle
    (() => window.getComputedStyle(document.body))();

    // Wait for next tick before removing
    setTimeout(() => {
      document.head.removeChild(css);
    }, 1);
  };
};

const getSystemTheme = (e?: MediaQueryList | MediaQueryListEvent) => {
  if (!e) e = window.matchMedia(MEDIA);
  const isDark = e.matches;
  const systemTheme = isDark ? "dark" : "light";
  return systemTheme;
};

export function ArcoThemeProvider({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();

  const dropList = (
    <Menu onClickMenuItem={(key) => setTheme(key)}>
      <Menu.Item key="light">Light</Menu.Item>
      <Menu.Item key="dark">Dark</Menu.Item>
      <Menu.Item key="system">System</Menu.Item>
    </Menu>
  );

  return (
    <>
      <ConfigProvider>{children}</ConfigProvider>
      <div className="absolute bottom-4 right-4">
        <Dropdown droplist={dropList} position="bl" trigger="click">
          <Button type="text">
            <SunIcon className="block dark:hidden" />
            <MoonIcon className="hidden dark:block" />
          </Button>
        </Dropdown>
      </div>
    </>
  );
}

import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 * A digital garden for code, thoughts, and coffee ☕
 */

const config: QuartzConfig = {
  configuration: {
    pageTitle: "Bor's Digital Garden",
    pageTitleSuffix: " | Code & Coffee",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "dominicbor.me",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Kalam",
        body: "Kalam",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          light: "#FDF0E4",
          lightgray: "#F5E6D3",
          gray: "#8B7355",
          darkgray: "#4A3429",
          dark: "#2C1810",
          secondary: "#D4AF37",
          tertiary: "#E67E22",
          highlight: "rgba(212, 175, 55, 0.12)",
          textHighlight: "#FFF3D4",
        },
        darkMode: {
          light: "#1A232E",
          lightgray: "#243240",
          gray: "#7A8B99",
          darkgray: "#F5E6D3",
          dark: "#FDF0E4",
          secondary: "#D4AF37",
          tertiary: "#4A9EFF",
          highlight: "rgba(212, 175, 55, 0.15)",
          textHighlight: "#2D3748",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Plugin.CustomOgImages(), // Temporarily disabled until font issues are resolved
    ],
  },
}

export default config

import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.PageTitle(),
    Component.Spacer(),
    Component.Search(),
    Component.Darkmode(),
  ],
  afterBody: [],
  footer: Component.Footer({
    links: {
      "GitHub": "https://github.com/sirbor",
      "LinkedIn": "https://linkedin.com/in/dominicbor",
      "Twitter": "https://x.com/dominicbor", 
      "Email": "mailto:hello@dominicbor.me",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [],
  right: [],
}

// components for pages that display lists of pages (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
    Component.RecentNotes({
      title: "Latest Posts",
      limit: 8,
      showTags: true,
      linkToMore: false,
    }),
  ],
  left: [],
  right: [],
}

import { withPluginApi } from "discourse/lib/plugin-api";
import { tracked } from "@glimmer/tracking";

const PLUGIN_API_VERSION = "1.30.0";

export default {
  name: "sidebar-breadcrumbs",

  initialize(container) {
    withPluginApi(PLUGIN_API_VERSION, (api) => {
      const router = container.lookup("router:main");

      const themeSettings = container.lookup("service:theme-settings")[
        "theme-settings:main"
      ];

      const sectionTitle =
        (themeSettings && themeSettings.sidebar_breadcrumb_section_title) ||
        "Location";

      const showOnTopics =
        themeSettings?.sidebar_breadcrumb_show_on_topics ?? true;

      const showOnCategories =
        themeSettings?.sidebar_breadcrumb_show_on_categories ?? true;

      api.addSidebarSection(
        (BaseCustomSidebarSection, BaseCustomSidebarSectionLink) => {
          class SidebarBreadcrumbLink extends BaseCustomSidebarSectionLink {}

          class SidebarBreadcrumbSection extends BaseCustomSidebarSection {
            @tracked links = [];

            get name() {
              return "sidebar-breadcrumbs";
            }

            get title() {
              return sectionTitle;
            }

            get sectionLinks() {
              return this.links;
            }

            constructor() {
              super(...arguments);
              this.updateLinks();
              this.onAppEvent("page:changed", () => this.updateLinks());
            }

            updateLinks() {
              const currentRouteName = router.currentRouteName || "";
              const model = this.currentModel;

              if (!this.shouldShowOnRoute(currentRouteName, model)) {
                this.links = [];
                return;
              }

              const parts = this.buildBreadcrumbFromModel(
                currentRouteName,
                model
              );

              this.links = parts.map(
                (part) =>
                  new SidebarBreadcrumbLink({
                    title: part.title,
                    href: part.href,
                    icon: part.icon,
                  })
              );
            }

            shouldShowOnRoute(routeName) {
              if (routeName.startsWith("topic.") || routeName === "topic") {
                return showOnTopics;
              }

              if (
                routeName.startsWith("discovery.category") ||
                routeName.startsWith("tags.") ||
                routeName === "tags"
              ) {
                return showOnCategories;
              }

              return false;
            }

            get currentModel() {
              return router.currentRoute?.attributes;
            }

            buildBreadcrumbFromModel(routeName, model) {
              const parts = [];

              if (!model) {
                return parts;
              }

              parts.push({
                title: this.site?.homepageTitle || "Home",
                href: this.site?.homeRoute || "/",
                icon: "home",
              });

              if (routeName.startsWith("topic.") || routeName === "topic") {
                const topic = model;
                const category = topic.category;

                if (category) {
                  this.addCategoryHierarchy(parts, category);
                }

                parts.push({
                  title: topic.title,
                  href: topic.url,
                  icon: "link",
                });

                return parts;
              }

              if (routeName.startsWith("discovery.category")) {
                const category = model.category || model;

                if (category) {
                  this.addCategoryHierarchy(parts, category);
                }

                return parts;
              }

              if (routeName.startsWith("tags.") || routeName === "tags") {
                if (model && model.tag) {
                  parts.push({
                    title: `#${model.tag.id || model.tag}`,
                    href: model.tag.full_url || `/tag/${model.tag.id}`,
                    icon: "tag",
                  });
                }
                return parts;
              }

              return parts;
            }

            addCategoryHierarchy(parts, category) {
              const chain = [];
              let current = category;

              while (current) {
                chain.unshift(current);
                current = current.parent_category;
              }

              chain.forEach((cat) => {
                parts.push({
                  title: cat.name,
                  href: cat.url,
                  icon: "folder",
                });
              });
            }
          }

          return SidebarBreadcrumbSection;
        }
      );
    });
  },
};

# discourse-sidebar-breadcrumbs

A Discourse theme component that adds a breadcrumb-like navigation section to the core sidebar (Home > Category > Subcategory > Topic, or Home > #tag), and optionally hides the built-in `.category-breadcrumb` in the header.

## Features

- Adds a custom sidebar section showing the current location using the sidebar plugin API.
- Automatically rebuilds on route changes (topics, categories, tags).
- Optionally hides the default header `.category-breadcrumb`.
- All behavior is configurable via component settings.

## Installation

1. In your Discourse admin, go to **Customize > Themes > Install > From a git repository**.
2. Enter this repository's URL: `https://github.com/denvergeeks/discourse-sidebar-breadcrumbs`.
3. After installing, add the component to your active theme under **Components**.

## Settings

| Setting | Default | Description |
|---|---|---|
| `hide_header_category_breadcrumb` | `true` | Hides the built-in `.category-breadcrumb` in the header. |
| `sidebar_breadcrumb_section_title` | `Location` | Title of the sidebar breadcrumb section. |
| `sidebar_breadcrumb_show_on_topics` | `true` | Show breadcrumb on topic pages. |
| `sidebar_breadcrumb_show_on_categories` | `true` | Show breadcrumb on category/tag pages. |

## Compatibility

Built against the modern Discourse sidebar plugin API (`api.addSidebarSection`). Tested against Discourse `2026.7.0-latest`. Requires `minimum_discourse_version: 3.2.0` or later.

## License

MIT

# BagUI Studio

Browse, search, preview and install [BagUI](https://bagui.pro) components without leaving VS Code.

## Features

- **Sidebar** – a BagUI icon in the Activity Bar lists components by category (Marketing, Dashboard, Authentication, Forms, Buttons, Cards, Navigation, Templates).
- **Search** – `BagUI: Search Component` opens a live-filtering Quick Pick.
- **Preview** – a modern preview panel (dark/light) with description, category, tags, version and a Free / Pro badge.
- **Install** – one click runs `npx shadcn@latest add https://bagui.pro/r/<component>.json` in the integrated terminal of your project (pnpm, yarn and bun are detected from your lockfile).
- **Favorites** – right-click a component → *Add to Favorites*. Favorites are stored in VS Code's global state.
- **Offline friendly** – the registry is cached for 12 hours and a snapshot ships with the extension.

## Commands

| Command | Description |
| --- | --- |
| `BagUI: Open` | Reveal the BagUI sidebar |
| `BagUI: Search Component` | Search and preview a component |
| `BagUI: Install Component` | Install a component in the current workspace |
| `BagUI: Refresh Registry` | Clear the cache and reload the registry |
| `BagUI: Open Documentation` | Open the BagUI documentation |

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `bagui.autoPreview` | `true` | Open the preview when a component is clicked |
| `bagui.theme` | `system` | Preview theme: `system`, `light` or `dark` |
| `bagui.registryPath` | `""` | Local `registry.json` file (takes priority) |
| `bagui.apiUrl` | `""` | HTTPS URL of a registry JSON endpoint |

## Requirements

Installing a component requires a project with [shadcn/ui](https://ui.shadcn.com) set up (`components.json`) and Node.js. Pro components may require a BagUI account.

## Development

```bash
npm install
npm run build:dev   # bundle (also copies ../registry.json to data/)
# press F5 in VS Code to launch the Extension Host
npm run package     # produces bagui-studio-<version>.vsix
```

## License

MIT

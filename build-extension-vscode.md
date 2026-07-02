You are a Senior TypeScript Engineer and VS Code Extension expert.

I already have a production Next.js application called BagUI.

Current project structure:

bag-ui/
│
├── app/
├── components/
├── hooks/
├── lib/
├── providers/
├── public/
├── registry/
├── scripts/
├── types/
│
├── registry.json
├── package.json
└── tsconfig.json

I want to add a new folder at the root:

vscode/

The VS Code extension must live inside this folder without affecting my existing Next.js application.

=========================================================
GOAL
=========================================================

Create the official BagUI VS Code Extension.

The extension should allow developers to browse BagUI components, preview them, search them and install them without leaving VS Code.

The extension must NEVER duplicate the registry.

It must use the existing registry.json from my project as the single source of truth.

Later, this registry will be served from an API, so the code must already be designed for this migration.

=========================================================
TECH STACK
=========================================================

- TypeScript
- VS Code Extension API
- Webview API
- TreeView API
- Command API
- Node.js
- esbuild
- pnpm

Strict TypeScript.

No "any".

No duplicated code.

=========================================================
PROJECT STRUCTURE
=========================================================

Create:

vscode/

inside it:

src/
extension.ts

    commands/
        open.ts
        install.ts
        refresh.ts
        search.ts

    providers/
        ComponentTreeProvider.ts

    services/
        RegistryService.ts
        InstallService.ts
        CacheService.ts

    webviews/
        ComponentPreview.ts

    types/

    utils/

media/

package.json

tsconfig.json

README.md

.vscodeignore

=========================================================
REGISTRY
=========================================================

The extension must read the existing:

../registry.json

Do NOT hardcode any components.

RegistryService should expose:

getCategories()

getComponents()

getComponent(slug)

search(query)

Later this service should be easily replaced by an HTTP API without changing the rest of the extension.

=========================================================
SIDEBAR
=========================================================

Create a new Activity Bar icon:

BagUI

Inside it display:

⭐ Favorites

Marketing

Dashboard

Authentication

Forms

Buttons

Cards

Navigation

Each category expands into components.

=========================================================
SEARCH
=========================================================

Register command:

BagUI: Search Component

Use QuickPick.

Typing should instantly filter components.

Selecting one opens Preview.

=========================================================
PREVIEW
=========================================================

Clicking a component opens a Webview.

Display:

Component name

Description

Category

Tags

Preview image

Version

Free / Pro badge

Buttons:

Install

Copy CLI

Open Documentation

The UI must look like a modern SaaS product.

Dark mode support.

=========================================================
INSTALL
=========================================================

Clicking Install should execute:

npx bagui add COMPONENT_SLUG

Use the VS Code Terminal API.

If there is no workspace opened,
display an error.

If terminal doesn't exist,
create one.

=========================================================
FAVORITES
=========================================================

Allow:

Right Click

Add to Favorites

Store inside globalState.

Create Favorites section.

=========================================================
CACHE
=========================================================

Cache registry data.

Refresh every 12 hours.

Manual refresh command.

=========================================================
SETTINGS
=========================================================

bagui.autoPreview

bagui.theme

bagui.registryPath

bagui.apiUrl

=========================================================
COMMANDS
=========================================================

Register:

BagUI: Open

BagUI: Search Component

BagUI: Refresh Registry

BagUI: Install Component

BagUI: Open Documentation

=========================================================
ERROR HANDLING
=========================================================

Handle:

missing registry

invalid registry

workspace not opened

terminal unavailable

offline mode

=========================================================
ARCHITECTURE
=========================================================

Use clean architecture.

Separate:

Commands

Services

Providers

UI

Utilities

Types

Every service should have a single responsibility.

=========================================================
FUTURE FEATURES
=========================================================

The architecture must already support:

Authentication

Pro Components

Cloud Sync

Favorites Sync

AI Search

Collections

Templates

Update Checker

=========================================================
IMPORTANT
=========================================================

Do NOT modify my existing Next.js project.

Everything related to VS Code must stay inside:

/vscode

Generate all files.

Generate complete production-ready code.

No TODOs.

No placeholders.

Follow VS Code Extension best practices.

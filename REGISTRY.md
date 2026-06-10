# BagUI Registry System

This document explains the automatic registry discovery system that powers component management in BagUI.

## Overview

The registry system automatically discovers all components in the `registry/default/blocks` directory and generates the necessary metadata and loaders for dynamic component loading in the UI.

**Key Benefits:**

- ✅ No manual registration required
- ✅ Automatically discovers new components
- ✅ Scales to 100+ components without changes
- ✅ Developer-friendly watch mode during development

## Directory Structure

```
registry/
└── default/
    └── blocks/
        ├── hero/
        │   ├── hero1.tsx
        │   ├── hero2.tsx
        │   └── hero3.tsx
        ├── navbar/
        │   ├── navbar1.tsx
        │   └── navbar2.tsx
        ├── login/
        │   └── login1.tsx
        ├── pricing/
        ├── dashboard/
        ├── faq/
        └── footer/
```

Each category folder can contain unlimited `.tsx` component files.

## How It Works

### 1. Generation Script (`scripts/generate-registry.ts`)

The generation script:

1. Scans `registry/default/blocks` recursively
2. Finds all `.tsx` files (excluding utility files)
3. Generates two files in `lib/`:
   - `registry-manifest.ts` - metadata about components
   - `registry-loaders.ts` - dynamic import statements

### 2. Watch Mode (`scripts/watch-registry.ts`)

The watch script uses [chokidar](https://github.com/paulmillr/chokidar) to monitor the registry directory. When files are added, deleted, or renamed, it automatically regenerates the files.

### 3. Generated Files

#### `lib/registry-manifest.ts`

```typescript
export const registryManifest = [
  {
    name: "hero1",
    category: "hero",
    path: "registry/default/blocks/hero/hero1.tsx",
  },
  // ...
] as const;

export function getComponentsByCategory(category: string) { ... }
export function getAllCategories() { ... }
export function findComponent(name: string) { ... }
```

**Uses:**

- Building component listings UI
- Building category pages
- Search and filtering
- Dynamic component discovery

#### `lib/registry-loaders.ts`

```typescript
export const componentLoaders = {
  "registry/default/blocks/hero/hero1.tsx": () =>
    import("@/registry/default/blocks/hero/hero1"),
  // ...
};
```

**Uses:**

- Lazy loading component previews
- Avoiding loading all components at startup
- Used by `ComponentPreview.tsx`

## Usage

### Development

```bash
npm run dev
```

This runs both the registry watcher and Next.js development server simultaneously. The watcher monitors for changes and regenerates the registry files automatically.

### Manual Generation

```bash
npm run registry:generate
```

Manually regenerate the registry files (useful for CI/CD pipelines).

### Watch Only

```bash
npm run registry:watch
```

Run just the watch script without the development server.

## Adding New Components

1. Create a new `.tsx` file in the appropriate category:

```bash
touch registry/default/blocks/pricing/pricing1.tsx
```

2. Export your component:

```typescript
export default function Pricing1() {
  return <div>My Pricing Component</div>;
}
```

3. **That's it!** The watcher detects the new file and automatically regenerates the registry.

## Excluded Files

The following files are automatically ignored and won't be included in the registry:

- `index.ts`, `index.tsx`
- `types.ts`, `types.tsx`
- `utils.ts`, `utils.tsx`
- `hooks.ts`, `hooks.tsx`

Use these files for shared utilities within category folders without them being registered as components.

## Ignored Files Pattern

Files matching these patterns are not scanned:

- Hidden files (starting with `.`)
- `node_modules` directories
- Already existing in `.gitignore`

## Generated Files in Git

The generated files should **not** be committed to Git:

```bash
# .gitignore
/lib/registry-manifest.ts
/lib/registry-loaders.ts
```

They are regenerated automatically during:

1. Development (via watch script)
2. Build time (via `npm run build`)

## Build Process

```bash
npm run build
```

This automatically runs `registry:generate` before building with Next.js, ensuring the registry is always up-to-date.

## Examples

### Listing All Categories

```typescript
import { getAllCategories } from "@/lib/registry-manifest";

const categories = getAllCategories();
// ["hero", "navbar", "login", "pricing", ...]
```

### Finding a Specific Component

```typescript
import { findComponent } from "@/lib/registry-manifest";

const component = findComponent("hero1");
// { name: "hero1", category: "hero", path: "..." }
```

### Getting Components by Category

```typescript
import { getComponentsByCategory } from "@/lib/registry-manifest";

const heroComponents = getComponentsByCategory("hero");
// [{ name: "hero1", ... }, { name: "hero2", ... }]
```

### Lazy Loading Components

```typescript
import { componentLoaders } from "@/lib/registry-loaders";

// Later, when needed:
const Module =
  await componentLoaders["registry/default/blocks/hero/hero1.tsx"]();
const HeroComponent = Module.default; // or Module.HeroName if named export
```

## Future Enhancements

### Metadata Files

Currently, components are discovered by filename. Future versions could support optional metadata files:

```json
// registry/default/blocks/hero/hero1.json
{
  "title": "Modern Hero",
  "description": "A hero section with split layout",
  "tags": ["hero", "landing", "featured"],
  "featured": true,
  "author": "Team"
}
```

The system is designed to support this without architectural changes. Metadata would be:

1. Read alongside component files
2. Merged into `registry-manifest.ts`
3. Available for filtering and display

### Multiple Registries

Support for multiple registries:

```
registry/
├── default/
│   └── blocks/
└── premium/
    └── blocks/
```

### Export Variants

Auto-detect multiple exports per file:

```typescript
// button-variants.tsx
export function ButtonSmall() { ... }
export function ButtonMedium() { ... }
export function ButtonLarge() { ... }
```

Would generate entries for each export.

## Troubleshooting

### Registry not updating in dev mode?

1. Check that `npm run dev` is running
2. Ensure watch script is active (look for watcher output)
3. Try manual regeneration: `npm run registry:generate`

### Components not showing in preview?

1. Verify the component file is in `registry/default/blocks/[category]/`
2. Check that the file ends with `.tsx`
3. Ensure the component exports properly (named or default export)
4. Run `npm run registry:generate` and check `lib/registry-loaders.ts`

### Type errors with generated files?

```bash
# Regenerate and ensure types are correct
npm run registry:generate

# Then check TypeScript
npm run lint
```

### Watch mode not detecting changes?

The watch script uses a 500ms debounce to avoid multiple regenerations. If experiencing issues:

1. Stop the process (`Ctrl+C`)
2. Run manual generation: `npm run registry:generate`
3. Restart with `npm run dev`

## Performance Considerations

- **Component Discovery**: O(n) where n = number of files in registry
- **Generation Time**: ~100ms for 100+ components
- **Memory**: Generated files are plain JavaScript objects (minimal overhead)
- **Watch Debounce**: 500ms to prevent excessive regenerations

For 1000+ components, consider:

1. Splitting into multiple category folders
2. Implementing lazy registry generation (category-based)
3. Caching parsed manifests

## Architecture Benefits

✅ **No Manual Configuration**: Components are discovered automatically
✅ **Scalable**: Handles 10, 100, or 1000+ components identically
✅ **Type-Safe**: Full TypeScript support with `as const`
✅ **Efficient**: Lazy loading via dynamic imports
✅ **Developer-Friendly**: Automatic watch mode in development
✅ **CI/CD Ready**: Regenerates on build
✅ **Extensible**: Metadata and variants can be added later

## References

- [chokidar](https://github.com/paulmillr/chokidar) - File watching library
- [concurrently](https://github.com/open-source-labs/concurrently) - Run multiple processes
- [tsx](https://github.com/esbuild-kit/tsx) - TypeScript execution

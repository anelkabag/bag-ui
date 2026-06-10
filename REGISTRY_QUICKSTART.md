# BagUI Registry Quick Start

## TL;DR - Adding a New Component

1. Create a new `.tsx` file:

```bash
# Example: Adding a new login component
touch registry/default/blocks/login/login1.tsx
```

2. Export your component:

```typescript
// registry/default/blocks/login/login1.tsx
export default function LoginForm() {
  return <form>{/* your form */}</form>;
}
```

3. **Done!** ✅ The registry automatically discovers it. No registration needed.

## Running Development

```bash
# Starts both the registry watcher and Next.js dev server
npm run dev
```

The watcher monitors `registry/default/blocks` and regenerates files when you add/modify/delete components.

## File Organization

Place components in logical categories:

```
registry/default/blocks/
├── hero/          # Landing hero sections
├── navbar/        # Navigation bars
├── login/         # Authentication forms
├── pricing/       # Pricing tables
├── dashboard/     # Dashboard layouts
├── faq/           # FAQ sections
└── footer/        # Footer layouts
```

**Each folder = one category, each `.tsx` file = one component.**

## What Gets Auto-Generated?

Two files in `lib/` are automatically created:

### `lib/registry-manifest.ts`

Component metadata - used for listings, search, filters:

```typescript
export const registryManifest = [
  { name: "login1", category: "login", path: "..." },
  // auto-generated
];
```

### `lib/registry-loaders.ts`

Dynamic imports - used by ComponentPreview:

```typescript
export const componentLoaders = {
  "registry/default/blocks/login/login1.tsx": () => import(...),
  // auto-generated
};
```

## Using Registry Data

```typescript
// Get all categories
import { getAllCategories } from "@/lib/registry-manifest";
const categories = getAllCategories(); // ["hero", "login", "navbar", ...]

// Get components by category
import { getComponentsByCategory } from "@/lib/registry-manifest";
const loginComponents = getComponentsByCategory("login");

// Find specific component
import { findComponent } from "@/lib/registry-manifest";
const component = findComponent("login1");
```

## What About Utility Files?

Place shared code in each category folder. These files are **NOT registered**:

```typescript
// registry/default/blocks/login/utils.ts
export function validateEmail(email: string) { ... }

// registry/default/blocks/login/types.ts
export interface LoginForm { ... }

// registry/default/blocks/login/hooks.ts
export function useLoginForm() { ... }
```

Use them in your components:

```typescript
// registry/default/blocks/login/login1.tsx
import { useLoginForm } from "./hooks";
import { validateEmail } from "./utils";

export default function LoginForm() {
  // your component
}
```

## Build & Deploy

```bash
# Regenerates registry before building
npm run build

# The registry is regenerated automatically
# (no manual steps needed)
```

## Troubleshooting

**Q: I added a component but it's not showing up?**

- Restart dev server (`Ctrl+C`, then `npm run dev`)
- Check the file is in `registry/default/blocks/[category]/`
- Ensure it ends with `.tsx`

**Q: Files aren't regenerating on change?**

- Make sure `npm run dev` is running (watch script must be active)
- Try manual generation: `npm run registry:generate`

**Q: What if I need metadata for components?**

- Future versions will support `.json` metadata files
- For now, add metadata to your component props/defaults

## Key Rules

✅ **DO:**

- Put components in `registry/default/blocks/[category]/`
- Use `.tsx` extension
- Export components (default or named)
- Create utility files for shared code

❌ **DON'T:**

- Manually edit `lib/registry-manifest.ts` or `lib/registry-loaders.ts`
- Put components outside the registry folder
- Use `.ts` instead of `.tsx` for components
- Manually update ComponentPreview imports

## API Reference

See [REGISTRY.md](./REGISTRY.md) for complete documentation.

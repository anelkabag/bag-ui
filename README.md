<p align="center">
  <img src="./public/logoR.png" width="100" alt="BagUi Logo" />
</p>

<h1 align="center">BagUi</h1>

<p align="center">
  A modern, open-source registry of UI components, blocks, and ready-to-use sections — built to help developers ship polished interfaces faster with shadcn/ui.
</p>

<p align="center">
  <a href="https://bagui.vercel.app"><strong>Live Site</strong></a> ·
  <a href="#-getting-started">Getting Started</a> ·
  <a href="#-contributing">Contributing</a> ·
  <a href="#-project-structure">Project Structure</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-black?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/Next.js-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-black?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-black?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PRs-welcome-black?style=flat-square" alt="PRs Welcome" />
</p>

<p align="center">
  <img src="./public/cover.png" alt="BagUi Preview" />
</p>

<p align="center"><strong>Built by Anelka Bag</strong></p>

---

## ✨ About

**BagUi** is an open-source component registry offering a growing collection of production-ready UI blocks, sections, and components — navbars, heroes, footers, pricing tables, CTAs, and more — built with a strong focus on clean design and smooth animations.

### Tech Stack

- [Next.js](https://nextjs.org) — React framework
- [TypeScript](https://www.typescriptlang.org) — type safety
- [Tailwind CSS](https://tailwindcss.com) — utility-first styling
- [shadcn/ui](https://ui.shadcn.com) — component foundation
- [Framer Motion](https://www.framer.com/motion) — animations

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) `v18+`
- [npm](https://www.npmjs.com) (or `pnpm` / `yarn`, if you prefer)
- [Git](https://git-scm.com)

### 1. Clone the repository

```bash
git clone https://github.com/anelkabag/bagui.git
cd bagui
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 🤝 Contributing

BagUi is open source, and contributions are very welcome! Whether it's a new component, a bug fix, or a documentation improvement — here's how to get started.

### 1. Fork & branch

```bash
git checkout -b feat/my-new-component
```

### 2. Add your component to the registry

Components live in two places:

| Type          | Path                                                 |
| ------------- | ---------------------------------------------------- |
| Blocks        | [`registry/default/blocks`](registry/default/blocks) |
| UI components | [`registry/default/ui`](registry/default/ui)         |

**Rules to follow:**

- If the component's category doesn't exist yet, create a new folder for it.
- Blocks should be organized by category, e.g.:
  - [`registry/default/blocks/navbar`](registry/default/blocks/navbar)
  - [`registry/default/blocks/hero`](registry/default/blocks/hero)
  - [`registry/default/blocks/feature`](registry/default/blocks/feature)
- Place the component file in the right folder, e.g.:
  - `registry/default/blocks/navbar/navbar1.tsx`

### 3. Create the component file

```tsx
export default function Navbar1() {
  return (
    <nav className="flex items-center justify-between p-4">
      <div className="font-semibold">BagUi</div>
      <div className="flex gap-3">Home</div>
    </nav>
  );
}
```

Keep it clean, reusable, and consistent with the project's existing conventions.

### 4. Register it in `registry.json`

Add an entry for your component in the `items` section of [`registry.json`](registry.json):

```json
{
  "name": "navbar1",
  "type": "registry:block",
  "title": "Navbar Example 1",
  "description": "Modern and responsive navigation.",
  "files": [
    {
      "path": "registry/default/blocks/navbar/navbar1.tsx",
      "type": "registry:block",
      "target": "components/blocks/navbar1.tsx"
    }
  ],
  "access": {
    "tier": "free"
  }
}
```

**Checklist before saving:**

- [ ] `name` is unique across the registry
- [ ] `path` points to the correct file under [`registry/default`](registry/default)
- [ ] `target` matches the expected destination in a consumer project
- [ ] `access.tier` is set to `free` or `pro`

### 5. Verify & build

```bash
npm run build
npm run registry:build
```

The first command makes sure the app compiles correctly. The second prepares and publishes your component to the registry.

### 6. Open a pull request

1. Commit your changes with a clear message
2. Push your branch
3. Open a PR including:
   - the component name
   - what it adds / fixes
   - screenshots or a short screen recording, if possible

---

## 📁 Project Structure

```text
bagui/
├── registry/
│   └── default/
│       ├── blocks/    # UI blocks & page sections (navbar, hero, footer, ...)
│       └── ui/         # Reusable base UI components
├── registry.json       # Registry manifest — lists all available components
└── public/              # Static assets
```

---

## ✅ Quick Checklist for a New Component

- [ ] File created in the correct folder
- [ ] Component renders and works correctly
- [ ] Component added to [`registry.json`](registry.json)
- [ ] `npm run build` passes
- [ ] `npm run registry:build` passes
- [ ] Pull request opened

---

## 💡 Tips

- Keep components simple, clean, and well named.
- Follow the existing structure to stay consistent with the rest of the project.
- Introducing a new block type? Create the matching category under [`registry/default/blocks`](registry/default/blocks) first.
- When in doubt, look at how similar existing components are structured before writing your own.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/anelkabag">Anelka Bag</a> — contributions welcome!
</p>

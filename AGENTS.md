# AGENTS.md

## Project Overview
Astro + React AR glasses try-on application using MediaPipe Face Mesh for face detection and Three.js for 3D rendering.

## Build Commands

```bash
# Development
npm run dev          # Start dev server at localhost:4321
npm run astro dev     # Same as above

# Production
npm run build         # Build for production
npm run preview       # Preview production build

# Astro CLI
npm run astro -- <command>  # Run astro commands (check, sync, etc.)
```

**No test framework is currently configured.** If adding tests, use Vitest (Astro's default).

---

## Code Style Guidelines

### General
- **Indentation**: 4 spaces (as seen in all .jsx/.tsx files)
- **Quotes**: Double quotes for strings
- **Semicolons**: No semicolons at line ends
- **Trailing commas**: Last item in multi-line objects/arrays should not have trailing comma

### File Extensions
- Astro components: `.astro`
- React components: `.jsx` (not `.tsx` unless TypeScript needed)
- TypeScript hooks/stores: `.tsx`
- Plain TypeScript: `.ts`

### Astro Components
- Frontmatter uses `---` delimiters at start of file
- Components use `client:only="react"` directive for React components (required)
- Import React components with extension: `import Header from '../components/Header.jsx'`

```astro
---
import Header from '../components/Header.jsx'
import { ClientRouter } from "astro:transitions";
---

<!doctype html>
<html lang="en">
  <body>
    <Header client:only="react"/>
    <slot />
  </body>
</html>
```

### React Components
- Use default exports
- Function component syntax (not arrow functions for named exports)
- Props are destructured directly in function signature

```jsx
import { useCartStore } from "../hooks/useCart";

export default function Header() {
    const { cart } = useCartStore();
    return (/* ... */);
}
```

### TypeScript Types
- Use `type` alias for simple types, `interface` for complex ones
- Define types in same file or in dedicated `types.ts` files
- Zod or inline validation for runtime type checking

```tsx
type Product = {
    id: number;
    price: number;
    reference: string;
    montura: string;
    marca: string;
    cantidad: number;
    img: string;
    material: string;
};
```

### State Management (Zustand)
- Store files in `src/hooks/`
- Use `create<StoreType>()` with TypeScript
- Persist middleware for localStorage

```tsx
export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({/* ... */}),
        { name: "cart-storage", storage: createJSONStorage(() => localStorage) }
    )
);
```

### Import Order
1. React imports (`useEffect`, `useState`, etc.)
2. Third-party library imports (`@mediapipe/*`, `three`, `zustand`, `react-icons`)
3. Relative imports (hooks, components, utils)
4. Astro/framework imports (`astro:transitions`)
5. CSS/styles imports

### CSS & Styling
- This project uses Tailwind CSS v4 (via `@tailwindcss/vite`)
- Custom utilities are available (e.g., `bg-primary`, `from-primary to-secondary`)
- Use `bg-linear-to-r from-primary to-secondary` for gradient backgrounds
- No custom CSS files unless necessary (global styles in `src/styles/global.css`)

### Error Handling
- Use optional chaining (`?.`) for accessing potentially null/undefined values
- Check array existence with `?.length` before accessing indices
- Return early to avoid nested conditionals

```tsx
if (!results.multiFaceLandmarks?.length) {
    setFaceDetected(false);
    return;
}
```

### MediaPipe Pattern
- Use global singletons for Camera and FaceMesh to avoid re-initialization
- Check `client:only="react"` in Astro pages for MediaPipe components

---

## Project Structure

```
src/
├── components/           # React components (.jsx)
│   ├── metodoPago/       # Payment method components
│   └── pagos/           # Payment components
├── hooks/               # Zustand stores, custom hooks (.tsx)
├── layouts/             # Astro layouts
├── pages/               # Astro pages (.astro)
│   ├── carrito.astro    # Cart page
│   ├── index.astro      # Main AR try-on page
│   ├── metodoPago.astro # Payment method page
│   └── pago.astro       # Payment page
├── styles/
│   └── global.css       # Global styles
└── env.d.ts             # Astro type declarations
```

## Key Technologies
- **Astro 5.x** - Meta-framework
- **React 19** - UI components (with `client:only="react"`)
- **TypeScript** - Strict mode enabled (`astro/tsconfigs/strict`)
- **Tailwind CSS 4** - Styling
- **MediaPipe Face Mesh** - Face detection
- **Three.js / React Three Fiber** - 3D rendering
- **Zustand** - State management

## Notes
- Comments in code use Spanish/Chinese/English inconsistently - pick one language per file
- FaceGlasses.jsx uses module-level globals (`globalFaceMesh`, `globalCamera`) as singletons
- Cart persists to localStorage via Zustand persist middleware
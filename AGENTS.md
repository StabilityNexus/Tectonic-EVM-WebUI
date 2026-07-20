## Project Stack
Next.js 16.1 (App Router), React 19.2, TypeScript 5, Tailwind CSS 4

## Build and Test Commands
Build: `npm run build`
Dev: `npm run dev`
Lint: `npm run lint`
*(No test command configured yet, standard `npm test` when available)*

## Code Style Conventions
- Use `"use client";` directive at the top of client components.
- Use explicit types/interfaces for data structures.
- Group related code using comment block dividers (e.g. `/* --- TYPES --- */`).

```typescript
"use client";

import { useState } from "react";

interface User {
  id: string;
  name: string;
}

export default function UserProfile({ user }: { user: User }) {
  const [active, setActive] = useState(false);
  return <div onClick={() => setActive(!active)}>{user.name}</div>;
}
```

## Architecture Constraints
- All pages and routing should be inside the `app/` directory (Next.js App Router).
- Reusable UI components belong in the `components/` directory.
- Utilities and helper functions belong in `lib/` and `hooks/`.
- Styling must use Tailwind CSS utility classes instead of separate CSS files.

## Boundaries
- NEVER commit secrets or `.env` files.
- NEVER modify files in `node_modules/`, `.next/`, or `out/`.
- Do not modify core configuration files (`next.config.ts`, `tsconfig.json`, `package.json`) unless explicitly instructed.

## Git Workflow
- Branches should use `feat/`, `fix/`, `chore/`, or `docs/` prefixes.
- Conventional commits format required: `feat: add navbar component`, `fix: correct wallet address truncation`.
- PRs should use Squash and Merge strategy only.

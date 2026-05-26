# Runtime Inventory

- `src/main.tsx`, `src/App.tsx`: SPA bootstrap and routing
- `src/features/auth/*`: Firebase client auth, persistence, route guard
- `src/features/landing/LandingPage.tsx`: public entrypoint and login CTA
- `src/features/dashboard/DashboardPage.tsx`: authenticated workspace
- `src/features/sticker/template.ts`: SVG template mutation and escaping logic
- `src/features/sticker/utils/export.ts`: browser-only PNG/SVG export and Web Share
- `vite.config.ts`: build-time environment exposure and bundler config
- `.env`, `.env.example`, `src/vite-env.d.ts`: Firebase config surface

Out of scope for privileged server enforcement:

- No backend API, database logic, or server-side authorization layer exists in this repository.

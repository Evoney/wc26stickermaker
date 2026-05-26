# WC26 Sticker Maker

Aplicação React + Vite para criação de figurinhas da Copa 2026 com template SVG, login Google via Firebase Authentication, landing page pública e dashboard protegida.

## Fluxo do sistema

1. O usuário acessa a landing page pública.
2. Faz login com Google.
3. A sessão Firebase é persistida no navegador.
4. Apenas com sessão ativa o usuário entra na dashboard.
5. Na dashboard ele personaliza a figurinha e exporta em PNG ou SVG.

## Arquitetura

```text
src/
  App.tsx
  features/
    auth/
      AuthProvider.tsx
      ProtectedRoute.tsx
      firebase.ts
      useAuth.ts
    dashboard/
      DashboardPage.tsx
    landing/
      LandingPage.tsx
    sticker/
      components/
      defaults.ts
      template.ts
      types.ts
      utils/
```

## Firebase

O projeto usa Firebase Authentication com Google Provider.

Defina no `.env.local` ou `.env`:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Observação:

- As variáveis `...` são públicas no bundle e não devem conter segredos privados.
- A proteção atual é de frontend com sessão real do Firebase. Se depois houver backend sensível, valide o token no servidor.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Verificação

```bash
npm run lint
npm run build
```

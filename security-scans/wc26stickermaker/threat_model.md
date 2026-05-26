# Threat Model

## Repository Scope

`wc26stickermaker` is a client-rendered React/Vite application that lets authenticated users generate, preview, export, and share personalized sticker images. It has no privileged backend in this repository; runtime trust is delegated mainly to Firebase Authentication and the hosting platform.

## Primary Product Surfaces

- Public landing page and login initiation flow
- Firebase Authentication session bootstrap and route gating
- Authenticated dashboard used to edit sticker data
- SVG/PNG export and Web Share flows
- Static hosting and environment-variable injection during build

## Assets And Privileges

- User session state issued by Firebase Authentication
- Correct scoping of client-visible configuration values
- Integrity of generated sticker output
- Availability of the dashboard and export flow
- Hosting configuration and deployment environment variables

## Trust Boundaries

- Browser user input into React state and SVG generation
- Browser application into Firebase Authentication
- Build-time environment into client bundle
- Authenticated route gating into local dashboard UI
- Local file upload into SVG preview/export pipeline

## Attacker-Controlled Inputs

- Text fields used in sticker generation
- Uploaded image file contents
- Browser navigation to protected routes without a valid session
- Any environment variables intentionally exposed to the client build

## Security Invariants

- Only explicitly public client configuration is bundled into the browser
- User-controlled sticker fields do not become executable markup or script
- Protected UI remains gated behind a valid Firebase session
- Export/share features do not leak files or data outside the user’s initiated action
- Hosting and auth configuration do not imply secret server-side trust that does not exist

## High-Impact Failure Modes

- Overbroad environment exposure leaking secrets into the browser bundle
- SVG/HTML injection leading to script execution in preview or export
- Broken auth flow or route gating exposing privileged data or server actions
- Unsafe file handling that executes uploaded content or reads arbitrary local paths
- Misleading “protected” UI that suggests security where no server enforcement exists

# Validation Report

## Validation Closure Table

| ledger row id | instance key | root-control file:line | entrypoint/source | sink/control | disposition | counterevidence or proof gap | survives |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CFG-001 | config-exposure:vite.config.ts:6 | `vite.config.ts:6` | Build-time env injection | `envPrefix` browser exposure | suppressed | Fixed during scan by removing broad `FIREBASE_` exposure and keeping only `VITE_` defaults | no |

## Notes

- `npm run lint` passed.
- `npm run build` passed after rerunning outside the sandbox.
- No additional candidate required runtime reproduction after focused code tracing.

# CV-builder Copilot Instructions

This file defines repository-specific guidance for AI coding assistance.

## Project Summary

- Monorepo with:
- Backend in Go (`server/`), REST API using Gorilla Mux.
- Frontend in React + TypeScript + Vite (`web/`).
- PostgreSQL storage (via `pgx`/`database/sql`) and SQL migrations.
- Cookie-based JWT auth flow.

## Primary Goals For AI Contributions

- Make minimal, targeted changes that match existing code style and architecture.
- Preserve current API contracts unless explicitly asked to change them.
- Keep backend and frontend behavior aligned when changing request/response shapes.
- Prefer small, readable functions over clever abstractions.
- Add tests for behavior changes when practical.

## Repository Structure

- Backend:
- Entrypoint: `server/cmd/main.go`
- API bootstrap/server wiring: `server/cmd/api/`
- Services: `server/services/` (feature-based: `auth`, `user`, `resume`, `health`)
- Data access layer per service: `store.go`
- Shared contracts/interfaces: `server/types/types.go`
- Middleware/helpers: `server/utils/`
- DB bootstrap/migrations: `server/db/`

- Frontend:
- App source: `web/src/`
- API clients: `web/src/api/`
- Feature/UI components: `web/src/components/` and `web/src/pages/`
- Auth context: `web/src/contexts/AuthContext.tsx`

## Backend Conventions (Go)

### Routing and Handler Pattern

- Follow existing feature handler pattern:
- `NewHandler(store...)`
- `RegisterRoutes(router)`
- private `handleX` methods for each endpoint.
- Keep endpoint registration in feature `routes.go`.
- Protected routes should use existing JWT middleware wrapper (`auth.WithJWTAuth`).

### Request/Response Handling

- Parse JSON with `utils.ParseJSON`.
- Validate payloads with `utils.Validate` and struct tags.
- Return errors through `utils.WriteError` and success through `utils.WriteJSON`.
- Keep response field names stable and consistent with frontend expectations.

### Data Layer

- Keep SQL and persistence logic in `store.go` files, not handlers.
- Respect interfaces in `server/types/types.go` when adding/changing store methods.
- Update interface definitions and all implementations together.

### Logging and Errors

- Keep informative logs around request start/end and failure points.
- Do not leak sensitive values (passwords, raw JWT secrets) in logs.
- Return user-facing errors that are actionable but not overly verbose.

### Auth and Security

- Preserve cookie-based auth behavior.
- Do not weaken middleware (`CORS`, `RateLimit`, auth checks) unless requested.
- If CORS changes are required, keep environment-based allowlist behavior.

## Frontend Conventions (React + TypeScript)

### API Layer

- Add/modify HTTP logic in `web/src/api/` first.
- Keep `withCredentials: true` for authenticated endpoints.
- Keep typed request/response interfaces close to API functions.
- Prefer throwing consistent `Error` messages from API wrappers.

### Components and State

- Keep components focused and composable.
- Reuse existing UI primitives under `web/src/components/ui/`.
- Preserve existing auth flow via `AuthContext` and `verifyToken`.
- Avoid introducing new global state libraries unless explicitly requested.

### Styling

- Respect existing styling approach (Tailwind + CSS files where already present).
- Reuse existing class patterns and utility helpers.

## API Contract Alignment Rules

When changing API behavior:

- Update backend handler payload structs and validation rules.
- Update frontend request/response interfaces in `web/src/api/`.
- Update all call sites that depend on changed fields.
- Ensure naming convention compatibility (`snake_case` in JSON where currently used).

## Migrations and Database Changes

- Put schema changes in new migration files under `server/db/migrations/`.
- Never edit old migrations that may already be applied in deployed environments.
- Keep down migrations correct for rollback safety.

## Testing Expectations

### Backend

- Prefer table-driven tests for handler/store logic where practical.
- Use existing test style with `testing`, `testify`, and `sqlmock`.
- If adding SQL logic, add or update store tests.
- If adding handler branching logic, add handler tests (or create if missing).

### Frontend

- Keep TypeScript strictness intact.
- At minimum, run lint/build checks when changing UI/API modules.
- Add tests only if test framework is introduced or already present for the touched area.

## Commands To Validate Changes

- Backend:
- `cd server && make test`
- `cd server && make run`
- `cd server && make migrate-up`

- Frontend:
- `cd web && npm run lint`
- `cd web && npm run build`
- `cd web && npm run dev`

## Change Scope and Safety Rules

- Do not perform broad refactors unless explicitly requested.
- Do not rename public routes, JSON fields, or exported frontend types without request.
- Do not introduce new dependencies if existing libraries already solve the need.
- Keep environment variable usage centralized in existing config patterns.

## When Implementing New Features

Follow this order unless told otherwise:

1. Define/adjust backend payload and route behavior.
2. Implement/adjust store methods and interfaces.
3. Wire frontend API client changes with proper typings.
4. Update UI components/pages that consume the API.
5. Add or update tests.
6. Run lint/build/tests and fix regressions.

## Pull Request Readiness Checklist

- Code compiles and passes relevant checks.
- No dead code or debug leftovers.
- API changes reflected in frontend clients.
- Error handling paths covered.
- Authenticated paths still include credentials and auth guard behavior.
- Migration files included for schema changes.

## Preferred AI Response Style For This Repo

- Briefly explain the plan before significant changes.
- List exact files changed and why.
- Call out contract changes explicitly.
- Include verification commands run and outcomes.
- If checks were not run, state that clearly.
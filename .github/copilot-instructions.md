# CV-builder Copilot Instructions

This file defines repository-specific guidance for AI coding assistance.

## Project Overview

Full-stack CV/resume builder with a **Go backend** (Chi router, PostgreSQL, go-jet) and **React/TypeScript frontend** (Vite, RTK Query, shadcn/ui, Tailwind).

**Architecture**: Monorepo with `server/` (backend) and `web/` (frontend). Backend uses OpenAPI-first design with code generation. Frontend consumes auto-generated RTK Query hooks.

**Go Module Name**: `cvbuilder` — used in `server/go.mod` and all import paths.

**Local Development**:
- Run via Docker Compose (postgres + backend with air hot-reload + frontend Vite dev server)
- Or run individually: `make run` in `server/`, `npm run dev` in `web/`
- Environment variables in `.env.local` at repo root (loaded by Makefile via `-include ../.env.local`)

**Ports**: backend on `:8080`, frontend dev server on `:5173`

---

## Repository Structure

```
server/
  main.go                        # Chi router setup, middleware, SPA fallback, server start
  go.mod                         # Go module: cvbuilder
  Makefile                       # All dev commands
  air.toml                       # Hot reload config
  api/
    openapi.yml                  # Source of truth for all API endpoints and schemas
    oapi-server.yml              # oapi-codegen config → generates generated/server/generated.go
  internal/
    handler/
      handler.go                 # Handler struct + NewHandler constructor
      get_auth_me.go             # One file per operation
      post_auth_login.go
      ...
    app_service/
      auth/                      # login.go, register.go, logout.go
      resume/                    # create_resume.go, update_resume.go, ...
      user/                      # get_profile.go, update_plan.go, ...
    repository/                  # Read-only queries (go-jet)
    mutation/                    # Write operations (go-jet)
    middleware/
      auth.go                    # JWT cookie validation + public route bypass
      rate_limit.go              # Per-IP rate limiter
    deps/
      deps.go                    # Shared dependency container (DB, etc.)
  db/
    migrations/                  # Goose sequential SQL migration files
  generated/
    server/
      generated.go               # Auto-generated — do NOT edit
    db/
      cvbuilder_db/public/
        model/                   # Auto-generated go-jet model structs — do NOT edit
        table/                   # Auto-generated go-jet table structs — do NOT edit

web/
  src/
    App.tsx                      # Route definitions
    main.tsx                     # App entry point — Redux Provider wraps the tree
    api/
      client.ts                  # Auto-generated RTK Query hooks — do NOT edit
    store/
      api.ts                     # Base RTK Query API (baseUrl, credentials, tagTypes)
      index.ts                   # Redux store + middleware config
    components/
      ProtectedRoute.tsx         # Auth gate component
      ui/                        # shadcn/ui components
    hooks/
      usePageTitle.ts            # Sets browser tab title
    pages/                       # One file per page/route
    i18n/
      index.ts                   # i18n initialisation
      locales/
        en.json                  # English strings
        id.json                  # Indonesian strings
    lib/
      utils.ts                   # cn() Tailwind merge helper
  rtk-query.config.cjs           # RTK Query codegen config
  vite.config.ts                 # Vite config — includes /api proxy to backend
  components.json                # shadcn/ui config
```

---

## Critical Development Workflows

### Backend: OpenAPI-First Development

**All API changes must follow this exact sequence:**

1. **Edit OpenAPI spec** (`server/api/openapi.yml`)
   - Define new paths, request/response schemas
   - Mark public routes with `security: []`

2. **Generate code**: `cd server && make openapi-codegen`
   - Generates `generated/server/generated.go` — strict server interface + Chi router wiring
   - Generates `web/src/api/client.ts` — RTK Query hooks (do NOT edit manually)

3. **Implement the handler** in `internal/handler/`
   - One file per endpoint, named after the operation (e.g. `get_resume.go`)
   - Handler calls into `internal/app_service/` for business logic

4. **Routes are auto-wired** by `oapi.HandlerFromMux(h, apiRouter)` in `main.go`

**Example handler** (auth-protected endpoint):
```go
func (h *Handler) GetResume(ctx context.Context, request oapi.GetResumeRequestObject) (oapi.GetResumeResponseObject, error) {
    userID := middleware.UserIDFromContext(ctx)

    resume, err := resume.GetResume(ctx, h.deps, request.Params.Id, userID)
    if err != nil {
        if errors.Is(err, resume.ErrNotFound) {
            return oapi.GetResume404JSONResponse{Message: "resume not found"}, nil
        }
        return nil, err
    }

    return oapi.GetResume200JSONResponse{
        Id:              resume.ID,
        Title:           resume.Title,
        TemplateName:    resume.TemplateName,
        TemplateVersion: resume.TemplateVersion,
        Data:            resume.Data,
        CreatedAt:       resume.CreatedAt,
        UpdatedAt:       resume.UpdatedAt,
    }, nil
}
```

**Example handler** (custom response that sets a cookie):
```go
type loginCookieResponse struct {
    user  oapi.AuthUser
    token string
}

func (r loginCookieResponse) VisitPostAuthLoginResponse(w http.ResponseWriter) error {
    http.SetCookie(w, &http.Cookie{
        Name:     middleware.CookieName,
        Value:    r.token,
        HttpOnly: true,
        Path:     "/",
        SameSite: http.SameSiteLaxMode,
    })
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(200)
    return json.NewEncoder(w).Encode(r.user)
}

func (h *Handler) PostAuthLogin(ctx context.Context, request oapi.PostAuthLoginRequestObject) (oapi.PostAuthLoginResponseObject, error) {
    user, token, err := auth.Login(ctx, h.deps, string(request.Body.Email), request.Body.Password)
    if err != nil {
        if errors.Is(err, auth.ErrInvalidCredentials) {
            return oapi.PostAuthLogin401JSONResponse{Message: "invalid credentials"}, nil
        }
        return nil, err
    }
    return loginCookieResponse{user: oapi.AuthUser{Id: user.ID, Email: user.Email, Plan: string(user.Plan)}, token: token}, nil
}
```

### Backend: Database Migrations

**Pattern**: Sequential Goose migrations + auto-generated type-safe models (go-jet)

1. **Create migration**: `make migration-create name=<migration_name>`
   - Creates a sequential `.sql` file in `db/migrations/`
   - Edit both `-- +goose Up` and `-- +goose Down` blocks

2. **Run migrations**: `make migration-up`
   - Migrates local DB using `DATABASE_URL` from `.env.local`
   - Auto-regenerates go-jet models in `generated/db/`

3. **Rollback**: `make migration-down`

4. **Status**: `make migration-status`

**Migration file format**:
```sql
-- +goose Up
-- +goose StatementBegin
CREATE TABLE resume_tbl (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID        NOT NULL REFERENCES user_tbl(id) ON DELETE CASCADE,
    title            TEXT        NOT NULL,
    template_name    TEXT        NOT NULL,
    template_version INT         NOT NULL DEFAULT 1,
    data             JSONB       NOT NULL DEFAULT '{}',
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS resume_tbl;
-- +goose StatementEnd
```

**Never write raw SQL in business logic** — use go-jet models from `generated/db/cvbuilder_db/public/model` and table structs from `generated/db/cvbuilder_db/public/table`.

### Backend: Repository + Mutation Pattern

**Repository** = read-only queries (`internal/repository/`)
**Mutation** = write operations (`internal/mutation/`)

Both accept `qrm.DB` (accepts `*sql.DB` or `*sql.Tx`).

**Repository example**:
```go
package repository

import (
    pg "github.com/go-jet/jet/v2/postgres"
    "github.com/go-jet/jet/v2/qrm"
    "cvbuilder/generated/db/cvbuilder_db/public/model"
    "cvbuilder/generated/db/cvbuilder_db/public/table"
)

func GetResumeByID(ctx context.Context, db qrm.DB, id uuid.UUID, userID uuid.UUID) (*model.ResumeTbl, error) {
    tbl := table.ResumeTbl

    stmt := pg.SELECT(tbl.AllColumns).
        FROM(tbl).
        WHERE(tbl.ID.EQ(pg.UUID(id)).AND(tbl.UserID.EQ(pg.UUID(userID))))

    var rows []model.ResumeTbl
    if err := stmt.QueryContext(ctx, db, &rows); err != nil {
        return nil, err
    }
    if len(rows) == 0 {
        return nil, nil
    }
    return &rows[0], nil
}

func ListResumesByUser(ctx context.Context, db qrm.DB, userID uuid.UUID) ([]model.ResumeTbl, error) {
    tbl := table.ResumeTbl

    stmt := pg.SELECT(tbl.AllColumns).
        FROM(tbl).
        WHERE(tbl.UserID.EQ(pg.UUID(userID))).
        ORDER_BY(tbl.CreatedAt.DESC())

    var rows []model.ResumeTbl
    if err := stmt.QueryContext(ctx, db, &rows); err != nil {
        return nil, err
    }
    return rows, nil
}
```

**Mutation example**:
```go
package mutation

import (
    pg "github.com/go-jet/jet/v2/postgres"
    "github.com/go-jet/jet/v2/qrm"
    "cvbuilder/generated/db/cvbuilder_db/public/model"
    "cvbuilder/generated/db/cvbuilder_db/public/table"
)

func InsertResume(ctx context.Context, db qrm.DB, userID uuid.UUID, title, templateName string, templateVersion int, data string) (*model.ResumeTbl, error) {
    tbl := table.ResumeTbl

    record := model.ResumeTbl{
        ID:              uuid.New(),
        UserID:          userID,
        Title:           title,
        TemplateName:    templateName,
        TemplateVersion: templateVersion,
        Data:            data,
        CreatedAt:       time.Now().UTC(),
        UpdatedAt:       time.Now().UTC(),
    }

    stmt := tbl.INSERT(tbl.MutableColumns).
        MODEL(record).
        RETURNING(tbl.AllColumns)

    var dest []model.ResumeTbl
    if err := stmt.QueryContext(ctx, db, &dest); err != nil {
        return nil, err
    }
    return &dest[0], nil
}

func UpdateResume(ctx context.Context, db qrm.DB, id uuid.UUID, templateName string, templateVersion int, data string) (*model.ResumeTbl, error) {
    tbl := table.ResumeTbl

    cols := pg.ColumnList{tbl.TemplateName, tbl.TemplateVersion, tbl.Data, tbl.UpdatedAt}
    record := model.ResumeTbl{
        TemplateName:    templateName,
        TemplateVersion: templateVersion,
        Data:            data,
        UpdatedAt:       time.Now().UTC(),
    }

    stmt := tbl.UPDATE(cols).
        MODEL(record).
        WHERE(tbl.ID.EQ(pg.UUID(id))).
        RETURNING(tbl.AllColumns)

    var dest []model.ResumeTbl
    if err := stmt.QueryContext(ctx, db, &dest); err != nil {
        return nil, err
    }
    return &dest[0], nil
}
```

**go-jet gotchas**:
- `tbl.UPDATE(columnList)` — pass `pg.ColumnList` directly, never spread (`...`)
- Dynamic updates: build a `pg.ColumnList` and corresponding model fields conditionally
- `tbl.MutableColumns` excludes the primary key; use for INSERT
- Always `RETURNING(tbl.AllColumns)` on INSERT/UPDATE to get the DB-assigned values back

### Backend: App Service Layer

`internal/app_service/<domain>/` — one file per action (e.g. `create_resume.go`, `update_resume.go`)

- Orchestrates repository reads, mutation writes, and side-effects (JWT generation, plan checks, etc.)
- Receives `deps.Deps` (not raw `*sql.DB`) so it can access any future dependency
- Returns domain errors (`errors.New("...")`) for expected failures; return raw `error` for unexpected ones
- Handlers switch on error type/value to map to HTTP response codes

**App service example** (with plan limit check):
```go
package resume

import (
    "context"
    "errors"

    "cvbuilder/internal/deps"
    "cvbuilder/internal/mutation"
    "cvbuilder/internal/repository"
    "github.com/google/uuid"
)

var (
    ErrNotFound    = errors.New("resume not found")
    ErrLimitReached = errors.New("resume limit reached for current plan")
)

var PlanLimits = map[string]int{
    "free": 1,
    "mid":  3,
    "pro":  100,
}

func CreateResume(ctx context.Context, d deps.Deps, userID uuid.UUID, title, templateName string, templateVersion int, data string) (*model.ResumeTbl, error) {
    user, err := repository.GetUserByID(ctx, d.DB, userID)
    if err != nil {
        return nil, err
    }

    existing, err := repository.ListResumesByUser(ctx, d.DB, userID)
    if err != nil {
        return nil, err
    }

    limit := PlanLimits[user.Plan]
    if len(existing) >= limit {
        return nil, ErrLimitReached
    }

    return mutation.InsertResume(ctx, d.DB, userID, title, templateName, templateVersion, data)
}
```

### Backend: Authentication

- JWT stored in an `HttpOnly` cookie named `access_token` (see `middleware.CookieName`)
- Cookie is set on login/register, cleared on logout
- Middleware (`internal/middleware/auth.go`) validates the token on every request
- Public routes are bypassed in the switch statement at the top of `Auth()`:
  ```go
  switch r.URL.Path {
  case "/api/auth/register", "/api/auth/login", "/api/auth/logout", "/api/health":
      next.ServeHTTP(w, r)
      return
  }
  ```
- To add a new public route, add its path to that switch case
- User ID is available in handlers via `middleware.UserIDFromContext(ctx)`

### Backend: Adding Dependencies

- Add application dependencies (DB, Redis, etc.) to `internal/deps/deps.go`
- Pass `deps.Deps` through handler → app_service (never pass `*sql.DB` directly to handlers)
- Go tool dependencies (codegen, migration runner): add to `go.mod` `tool` block, then `go mod tidy`

### Backend: Running Locally

```bash
# With hot reload (recommended)
cd server && make run       # uses air — auto-reloads on .go file changes

# Without hot reload
cd server && make run-once  # go run main.go

# Full dev environment (DB + backend + frontend)
docker compose up -d        # from repo root
```

### Backend: Key Files Reference

| File | Purpose |
|------|---------|
| `main.go` | Chi router setup, middleware, SPA fallback, server start |
| `api/openapi.yml` | Source of truth for all API endpoints and schemas |
| `api/oapi-server.yml` | oapi-codegen config → generates `generated/server/generated.go` |
| `Makefile` | All dev commands (codegen, migrations, run, fmt) |
| `air.toml` | Hot reload config — watches `.go` and `.env.local` |
| `internal/handler/handler.go` | `Handler` struct + `NewHandler` constructor |
| `internal/deps/deps.go` | Shared dependency container |
| `internal/middleware/auth.go` | JWT cookie auth + public route bypass |
| `internal/middleware/rate_limit.go` | Per-IP rate limiter |
| `db/migrations/` | Goose SQL migration files |
| `generated/server/generated.go` | Auto-generated — do NOT edit |
| `generated/db/` | Auto-generated go-jet models — do NOT edit |

---

## Frontend: Architecture

**Tech stack**: React 18, TypeScript, Vite, Tailwind, RTK Query, shadcn/ui, react-router-dom v7

**Key principle**: All API hooks are auto-generated — only write page/component code that calls those hooks.

### Frontend: Type-Safe API Calls

**Generated hooks** live in `web/src/api/client.ts` — do NOT edit this file manually. Regenerate via:
```bash
cd server && make openapi-codegen
# or from web/:
npm run codegen
```

**Base API** (`web/src/store/api.ts`):
- `baseUrl: '/api'` — relative, handled by Vite proxy in dev
- `credentials: 'include'` — sends cookies with every request (required for JWT auth)
- Add new `tagTypes` here when adding resource-specific cache invalidation

**RTK Query config** (`web/rtk-query.config.cjs`):
- `schemaFile` points to `../server/api/openapi.yml`
- `outputFile` → `src/api/client.ts`

**Using hooks**:
```tsx
import { useGetAuthMeQuery, usePostAuthLogoutMutation } from '@/api/client'
import { useGetResumesQuery, usePostResumeMutation } from '@/api/client'

const ResumePage = () => {
  const { data: resumes, isLoading } = useGetResumesQuery()
  const [createResume] = usePostResumeMutation()
  // ...
}
```

### Frontend: Cache Invalidation

Define `tagTypes` in `src/store/api.ts` and use `providesTags`/`invalidatesTags` in the generated client via RTK Query config. For example, after creating a resume, invalidate the `Resumes` tag so the list refreshes automatically.

### Frontend: Adding a New Page

1. Add the route to `server/api/openapi.yml` and run `make openapi-codegen` (backend)
2. Create `web/src/pages/MyPage.tsx`
3. Add the route to `src/App.tsx` — wrap in `<ProtectedRoute>` if auth is required

**Page component pattern** (always use arrow functions):
```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePostResumeMutation } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const NewResumePage = () => {
  const navigate = useNavigate()
  const [createResume, { isLoading }] = usePostResumeMutation()

  const handleCreate = async () => {
    const result = await createResume({ title: 'My Resume', templateName: 'default' })
    if ('data' in result) {
      navigate(`/resumes/${result.data.id}`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create Resume</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleCreate} disabled={isLoading}>Create</Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default NewResumePage
```

### Frontend: Protected Routes

`src/components/ProtectedRoute.tsx` — uses `useGetAuthMeQuery()` to gate access:
- While loading: shows a spinner
- On error (401) or no data: redirects to `/login`
- Wrap any private route in `<ProtectedRoute>` in `App.tsx`

```tsx
<Route
  path="/resumes"
  element={
    <ProtectedRoute>
      <ResumesPage />
    </ProtectedRoute>
  }
/>
```

### Frontend: UI Components (shadcn/ui)

Components live in `web/src/components/ui/`. Install new ones with:
```bash
cd web && npx --yes shadcn@latest add <component-name>
```

**Always use shadcn components over raw HTML**:
- `Button` — with `variant` (`default`, `outline`, `destructive`, `ghost`) and `size` (`sm`, `default`, `lg`)
- `Input` — controlled inputs
- `Label` — form labels (pair with `htmlFor`)
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` — layout containers
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` — data tables
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle` — modals
- `Select`, `SelectTrigger`, `SelectContent`, `SelectItem` — dropdowns
- `Textarea` — multi-line inputs
- `Badge` — plan tier labels, status indicators

**`cn()` utility** (`src/lib/utils.ts`): merges Tailwind classes safely — always use it when combining class strings:
```tsx
import { cn } from '@/lib/utils'
<div className={cn('base-class', isActive && 'active-class', className)} />
```

### Frontend: Styling Conventions

- Use Tailwind utility classes — no inline styles
- Use CSS variables for theming: `bg-muted`, `text-muted-foreground`, `text-destructive`, `bg-background`, etc.
- Spacing: use Tailwind scale (`p-4`, `gap-2`, `mt-6`) rather than custom pixel values
- Always arrow functions for components and handlers — no `function` declarations

### Frontend: UI/UX Conventions

**Page titles**: Every dashboard page must call `usePageTitle('...')` from `@/hooks/usePageTitle`. This sets the browser tab to `"<Title> — CV Builder"` and resets on unmount.

**Page heading + description**: Every page should have a heading (`<h1>`) and a short description (`<p>`):
```tsx
<div>
  <h1 className="text-xl font-semibold">My Resumes</h1>
  <p className="mt-1 text-sm text-muted-foreground">Build and manage your professional resumes.</p>
</div>
```

**Empty states**: When a list has no items, use a centered `Card` with a title, hint, and CTA button:
```tsx
<Card className="flex flex-col items-center justify-center py-12 text-center">
  <CardContent className="space-y-3">
    <p className="text-lg font-medium">No resumes yet</p>
    <p className="text-sm text-muted-foreground max-w-md">
      Create your first resume to get started. Choose from multiple templates.
    </p>
    <Button size="sm" onClick={handleCreate}>Create Resume</Button>
  </CardContent>
</Card>
```

**Plan limit badge**: Show user's current plan (free/mid/pro) as a `Badge` in the header or profile section. Do not gate UI — gate at the API level and show a friendly upgrade prompt in the response.

**Page layout patterns**:
- Standard pages (resume list, dashboard): `<div className="mx-auto max-w-6xl space-y-6">`
- Single-card pages (settings, auth forms): `<Card className="mx-auto max-w-2xl">`
- Editor pages (resume editor): `flex flex-col h-screen overflow-hidden`
- Tab pages: `useSearchParams` to persist active tab in URL (e.g. `?tab=versions`)

### Frontend: State Management

- **API state**: RTK Query (auto-generated hooks) — do not duplicate with useState
- **Redux slices** (`src/store/`): only for global UI state not covered by RTK Query (e.g. editor dirty state)
- **Local state** (`useState`): form fields, UI toggles within a single component
- Redux store is set up in `src/store/index.ts` — add slice reducers there

### Frontend: Key Files Reference

| File | Purpose |
|------|---------|
| `src/App.tsx` | Route definitions — add all new routes here |
| `src/main.tsx` | App entry point — Redux `Provider` wraps the tree |
| `src/api/client.ts` | Auto-generated RTK Query hooks — do NOT edit |
| `src/store/api.ts` | Base RTK Query API (baseUrl, credentials, tagTypes) |
| `src/store/index.ts` | Redux store + middleware config |
| `src/components/ProtectedRoute.tsx` | Auth gate component |
| `src/hooks/usePageTitle.ts` | Sets browser tab title to `"<Title> — CV Builder"` |
| `src/components/ui/` | shadcn/ui components |
| `src/lib/utils.ts` | `cn()` Tailwind merge helper |
| `src/pages/` | One file per page/route |
| `vite.config.ts` | Vite config — includes `/api` proxy to backend |
| `rtk-query.config.cjs` | RTK Query codegen config |
| `components.json` | shadcn/ui config (style, aliases, icon library) |

---

## Docker Compose (Dev Environment)

```yaml
services:
  cvbuilder-db:       # Postgres, port 5432, health-checked
  cvbuilder-backend:  # Go image, mounts ./server, runs air
  cvbuilder-frontend: # Node image, mounts ./web, runs Vite
```

**Backend startup sequence** (in compose command):
1. `goose up` — run pending migrations
2. `jet codegen` — regenerate go-jet models
3. `air` — start with hot reload

**Vite proxy**: All `/api` requests from the browser are proxied to backend port 8080 via Vite dev server. In production, the Go server itself serves the built frontend and handles `/api` routes.

---

## Common Pitfalls

1. **Never edit generated files**: `generated/server/generated.go`, `web/src/api/client.ts`, `generated/db/`
2. **Always run codegen after OpenAPI changes**: both backend and frontend types regenerate together — `make openapi-codegen`
3. **`types.Email` from oapi-codegen**: cast to `string` before passing to functions — `string(request.Body.Email)`
4. **go-jet `UPDATE` takes `ColumnList`, not a spread**: use `tbl.UPDATE(cols)` not `tbl.UPDATE(cols...)`
5. **JWT auth cookie requires `credentials: 'include'`** on the frontend base query — already set in `store/api.ts`
6. **New public routes must be added to the bypass list** in `internal/middleware/auth.go`
7. **`lib/utils.ts` must exist** for shadcn components to compile — it exports `cn()` using `clsx` + `tailwind-merge`
8. **Migration numbers are sequential** — never skip or reuse a number; name format is `00001_description.sql`
9. **After `make migration-up`, go-jet models regenerate automatically** — commit both migration and `generated/db/` changes
10. **Plan limit checks belong in app_service**, not in handlers or mutations — handlers only map errors to HTTP codes

---

## Commands To Validate Changes

**Backend:**
```bash
cd server && make openapi-codegen   # regenerate after OpenAPI changes
cd server && make migration-up      # apply pending migrations
cd server && make run               # start with air hot reload
cd server && go build ./...         # verify compilation
cd server && go test ./...          # run tests
```

**Frontend:**
```bash
cd web && npm run codegen           # regenerate RTK Query hooks
cd web && npm run lint              # lint check
cd web && npm run build             # TypeScript + Vite build
cd web && npm run dev               # start dev server
```

---

## Adding a New Feature (End-to-End Checklist)

1. [ ] Add migration if new table needed: `make migration-create name=<name>` → edit SQL → `make migration-up`
2. [ ] Add repository function in `internal/repository/`
3. [ ] Add mutation function in `internal/mutation/` (if writes needed)
4. [ ] Add app service in `internal/app_service/<domain>/<action>.go`
5. [ ] Add OpenAPI path + schemas in `server/api/openapi.yml`
6. [ ] Run `make openapi-codegen` — generates handler stub + frontend hook
7. [ ] Implement handler in `internal/handler/<operation>.go`
8. [ ] If public route: add path to bypass list in `internal/middleware/auth.go`
9. [ ] Create frontend page in `web/src/pages/`
10. [ ] Add route in `web/src/App.tsx` (wrap in `<ProtectedRoute>` if private)
11. [ ] Add translation keys to both `web/src/i18n/locales/en.json` and `id.json` if applicable
12. [ ] Run `go build ./...` to verify backend compiles
13. [ ] Run `npm run build` to verify frontend compiles

---

## Testing Expectations

### Backend

- Prefer table-driven tests for handler and repository logic where practical
- Use `testing`, `testify`, and `go-sqlmock` for unit tests
- If adding SQL logic in repository/mutation, add or update tests
- If adding handler branching logic (error mapping), add handler tests

### Frontend

- Keep TypeScript strictness intact
- At minimum, run lint/build checks when changing UI/API modules
- Add tests only if the test framework is already present for the touched area

---

## Pull Request Readiness Checklist

- Code compiles and passes `go build ./...` and `npm run build`
- `make openapi-codegen` was run and generated files are committed
- Migration files included for schema changes; `generated/db/` regenerated and committed
- No dead code or debug leftovers
- Plan limit logic is in app_service, not in handlers
- Error handling paths covered — domain errors mapped to HTTP codes in handler
- Authenticated paths still include credentials and auth guard behavior
- New public routes added to bypass list in `internal/middleware/auth.go`

---

## Preferred AI Response Style For This Repo

- Briefly explain the plan before significant changes
- List exact files changed and why
- Follow the order: OpenAPI spec → codegen → handler → app_service → repository/mutation → frontend page
- Call out contract changes explicitly
- Include verification commands run and outcomes
- If checks were not run, state that clearly
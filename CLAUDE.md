# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AgriPulse Core is a soil analysis platform for farmers — Spring Boot backend + React frontend. AI model logic lives in a separate **agricore-ai** service; integrate via its API only, never add model code here. Data is private per owner (farmer-scoped).

## Commands

Run backend commands from `backend/`, frontend from `frontend/`, Docker Compose from repo root.

**Backend:**

```bash
./mvnw spring-boot:run      # start dev server (port 8080)
./mvnw verify               # full build + tests
./mvnw test -Dtest=FooTest  # run a single test
```

**Frontend:**

```bash
npm run dev                 # start dev server (port 3000)
npm run build               # production build + tsc
npm run lint                # ESLint check
npm run format:check        # Prettier check
npm run format              # ESLint --fix + Prettier write (fixes most style issues)
npm run test                # vitest run
```

**Verification (before committing):**

- Frontend: `npm run lint && npm run format:check && npm run build`
- Backend: `./mvnw verify`

**Infrastructure:**

```bash
docker compose up -d        # start Postgres (port 5432, db: agripulse)
```

## Architecture

### Backend (`backend/src/main/java/com/agripulse/api/`)

**Layer order:** `web` → service interface → `service/impl` → `repository` → domain entity. `web` must never import `repository`.

**Key packages:**

- `web/` — controllers + `exception/GlobalRestExceptionHandler.java`
- `dto/<feature>/` — request/response DTOs (separate from domain)
- `service/` — interfaces; `service/impl/` — implementations
- `repository/` — Spring Data JPA repositories
- `model/domain/` — JPA entities (`SoilProfile`, `SoilNote`, `UserId`)
- `model/exceptions/` — domain exceptions (e.g. `SoilProfileNotFoundException`)
- `model/projections/` — aggregated read projections (mapped to DTOs in controller)
- `config/` — `SecurityConfig`, `JacksonConfig`, `OpenApiConfig`

**Auth:** Stateless JWT via Clerk (OAuth2 resource server). All `/api/**` routes require authentication. Farmer-owned resources must always be owner-scoped in services — never leak other users' data (return not-found, not forbidden, on ownership mismatch).

**DTO pattern:**

- Response DTOs: `static ResponseDTO from(Entity entity)` — mapping in controller
- Request DTOs: `Entity toEntity(...)` — entity created via args constructor, never `new Entity()` + setters
- PATCH updates: apply only non-null fields from update DTOs; keep update fields `@Nullable`
- Entities have `@NoArgsConstructor` for Hibernate only; use args constructors in application code

**Errors:** Always use `GlobalRestExceptionHandler`; responses are `application/problem+json`. No ad-hoc error bodies in controllers. Spring MVC Problem Details is enabled (`spring.mvc.problemdetails.enabled=true`).

**Multi-source responses:** Compose in the controller using DTO helpers. For heavy read shapes, put projection interfaces under `model/projections/` and map to DTOs in the controller.

### Frontend (`frontend/src/`)

**Data flow:** Route loader/component → React Query (`data/<feature>.ts`) → feature service (`services/<feature>/`) → `apiClient` (ky) → typed models (`services/<feature>/models.ts`)

**Key directories:**

- `routes/` — TanStack Router file-based routes; `(app)/` for authenticated app pages, `auth/` for auth pages, `__root.tsx` for router context
- `services/<feature>/` — ky-based HTTP calls + TypeScript models
- `data/<feature>.ts` — React Query `queryOptions`, hooks, mutations
- `components/ui/` — shadcn components (do not edit; add new ones with `npx shadcn add <component>`)
- `providers/` — theme and toast providers
- `i18n/locales/{en,mk}/translation.json` — flat-key translation files for both languages

**Auth:** Clerk via `@clerk/clerk-react`. Router context exposes `isLoaded`, `isSignedIn`, `getToken()`, `userId`. No custom auth logic.

**HTTP:** Use `apiClient` from `@/services/apiClient` exclusively — no `fetch` or axios. The client auto-attaches Bearer tokens, retries are disabled, and failed responses with `application/problem+json` are thrown as `APIError`. List endpoints returning `{ count, items }` are typed as `PaginatedResponse<T>`.

**i18n:** User-visible strings use `useTranslation` from `react-i18next`: `const { t } = useTranslation()`. Add every new key to **both** `en` and `mk` translation files. Do not hardcode user-facing text in components.

**Env:** Import from `@/env` (the exported `env` object via `@t3-oss/env-core`), never use `import.meta.env` directly.

**TypeScript:** No `any`, `as any`, or `as unknown as`. Folder names: kebab-case. Component names: PascalCase. Types: PascalCase. Non-component code: camelCase.

**Errors:** `APIError` is thrown by `apiClient`; handle in loaders (e.g. `notFound()` on 404) or UI. No bare `fetch` error handling patterns.

**Filtering/pagination:** Build a `URLSearchParams` in the feature service, add only the keys you need, and call `apiClient.get(path, { searchParams }).json()`. Define request param and response shapes in that feature's `models.ts`. List endpoints returning `{ count, items }` should be typed as `PaginatedResponse<T>` from `@/services/apiClient`.

## Tests

Do not add tests unless explicitly requested.

## Canonical Examples

The soil profile feature is the reference implementation for all patterns:

**Backend** (`backend/src/main/java/com/agripulse/api/`):

| Pattern                            | File                                                 |
| ---------------------------------- | ---------------------------------------------------- |
| Response DTO `from(entity)`        | `dto/soil_profile/SoilProfileDTO.java`               |
| Controller (maps entities → DTOs)  | `web/SoilProfileController.java`                     |
| Request DTO with `toEntity`        | `dto/soil_profile/CreateSoilProfileDTO.java`         |
| Update DTO with `@Nullable` fields | `dto/soil_profile/UpdateSoilProfileDTO.java`         |
| Domain entity + args constructor   | `model/domain/SoilProfile.java`                      |
| Service interface                  | `service/SoilProfileService.java`                    |
| Service impl (ownership + PATCH)   | `service/impl/SoilProfileServiceImpl.java`           |
| Domain not-found exception         | `model/exceptions/SoilProfileNotFoundException.java` |
| Global Problem Details handler     | `web/exception/GlobalRestExceptionHandler.java`      |

**Frontend** (`frontend/src/`):

| Pattern                                         | File                                          |
| ----------------------------------------------- | --------------------------------------------- |
| `apiClient`, `APIError`, `PaginatedResponse<T>` | `services/apiClient.ts`                       |
| Feature service (ky + typed `.json()`)          | `services/soil-profile/soilProfileService.ts` |
| TypeScript models                               | `services/soil-profile/models.ts`             |
| React Query `queryOptions` / hooks / mutations  | `data/soilProfile.ts`                         |
| Router context (`queryClient`, `auth`)          | `routes/__root.tsx`                           |
| Loader with `APIError` / `notFound()`           | `routes/(app)/soils/$soilId/index.tsx`        |
| `searchParams` on GET (filter/pagination)       | `services/geocoding/geocodingService.ts`      |

## Do Not

- Add AI model logic to this repo (use the `agricore-ai` API).
- Return entities from controllers — always map to DTOs.
- Import `repository` packages from `web`.
- Use `fetch` or axios — use `apiClient` only.
- Use `any`, `as any`, or `as unknown as` in TypeScript.
- Hardcode user-facing text — use i18n keys in both locale files.
- Use `import.meta.env` directly — import from `@/env`.
- Create `new Entity()` + setters to build new rows — use args constructors.
- Suppress real lint/type errors with casts or overrides to pass CI.

## Refer to AGENTS.md for more detailed and complete information

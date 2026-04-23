# AGENTS.md

## Project

Soil analysis and AI-assisted recommendations for farmers; data is private per owner. Stack: Spring Boot (`backend/`) + React (`frontend/`). AI model implementation lives in **agricore-ai** — integrate via its API only, no model code here.

- Compose: `compose.yaml` at repo root.
- Backend Java root: `backend/src/main/java/com/agripulse/api`
- Frontend: `frontend/src`

Run backend commands from `backend/`, frontend from `frontend/`, compose from repo root.

---

## Backend

- **Layers:** `web` → service interface → `service/impl` → `repository` → domain entity. `web` must not import `repository`.
- **Security:** Authenticated by default. Farmer-owned resources (soils, analyses, chats, etc.) must be owner-scoped in services (reads, updates, deletes, lists). Controllers pass identity into services. On violations, use not-found or forbidden as designed — do not leak other users’ data.
- **DTOs:** Services return domain entities. Controllers map to response DTOs (static `from(entity)` on response DTOs). Request DTOs may expose `toEntity(...)`; entities need a **real** constructor for creation (see entities below). PATCH-style updates: only apply non-null fields from update DTOs; keep update fields optional unless business requires replacement.
- **Entities (JPA vs application code):** JPA requires a no-args constructor on persisted entities. Satisfy it with Lombok `@NoArgsConstructor` (see e.g. `SoilProfile`) — that constructor is **for Hibernate only**, not for assembling new rows in app code. When **creating** a new entity instance, use an **args constructor** (or a DTO `toEntity` that calls it). Do not write `new SoilProfile()` (no-arg) and then `setName` / other setters to build a new row; handwritten creation paths should go through constructors. Updating an **already loaded** managed entity (e.g. PATCH) may still use setters where the codebase already does so.
- **Multi-source responses:** Compose in the controller using DTO helpers. Heavy read shapes: projection in `model/projections/`, map to DTO in controller.
- **Else:** Service interface + impl, Spring Data JPA, UUID ids, Lombok consistent with codebase, constructor injection. Errors via `web/exception/GlobalRestExceptionHandler.java`; use Problem Details (`application/problem+json`). No ad-hoc error bodies in controllers.

**Placement:** `web/`, `dto/<feature>/`, `service/`, `service/impl/`, `repository/`, `model/domain/`, `model/exceptions/`, `model/projections/`, `config/`

**Where to see it in code (soil profile feature):**

| Pattern                                     | File                                                                                         |
| ------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Response DTO `from(entity)`                 | `backend/src/main/java/com/agripulse/api/dto/soil_profile/SoilProfileDTO.java`               |
| Controller maps service entities → DTOs     | `backend/src/main/java/com/agripulse/api/web/SoilProfileController.java`                     |
| Request DTO `toEntity(...)`                 | `backend/src/main/java/com/agripulse/api/dto/soil_profile/CreateSoilProfileDTO.java`         |
| Domain entity + creation constructor        | `backend/src/main/java/com/agripulse/api/model/domain/SoilProfile.java`                      |
| Service interface (returns entities)        | `backend/src/main/java/com/agripulse/api/service/SoilProfileService.java`                    |
| Ownership + PATCH-style update in service   | `backend/src/main/java/com/agripulse/api/service/impl/SoilProfileServiceImpl.java`           |
| Nullable fields on update DTO               | `backend/src/main/java/com/agripulse/api/dto/soil_profile/UpdateSoilProfileDTO.java`         |
| Spring Data repository                      | `backend/src/main/java/com/agripulse/api/repository/SoilProfileRepository.java`              |
| Domain not-found style exception            | `backend/src/main/java/com/agripulse/api/model/exceptions/SoilProfileNotFoundException.java` |
| Global Problem Details / exception handling | `backend/src/main/java/com/agripulse/api/web/exception/GlobalRestExceptionHandler.java`      |

Projections: when you add aggregated read models, put interfaces/classes under `backend/src/main/java/com/agripulse/api/model/projections/` and map to DTOs in the controller (no dedicated example in repo yet).

---

## Frontend

- **Naming:** PascalCase components; kebab-case folders; camelCase for non-component code; PascalCase types.
- **Auth:** Clerk via router context — `isLoaded`, `isSignedIn`, `getToken()`, `userId`. No custom auth.
- **Data:** Route/loader/component → React Query (`frontend/src/data/`) → feature services (`frontend/src/services/<feature>/`, ky `apiClient`) → typed models. Env: `frontend/src/env.ts` + exported `env`, not raw `import.meta.env`.
- **UI:** shadcn in `frontend/src/components/ui/` — do not edit; add with `npx shadcn add <component>`. No `fetch`/axios; use `apiClient` only.
- **Errors:** Problem JSON → `APIError` in `apiClient`; handle in UI / loaders (e.g. `notFound()` on 404 where appropriate).
- **Router context:** `queryClient` plus `auth` (`isLoaded`, `isSignedIn`, `getToken`, `userId`).
- **i18n:** User-visible strings must go through `useLanguage().t("key")` from `frontend/src/providers/language-provider.tsx`. Add every key to **both** `en` and `mk` in that file’s `translations` object. Do not hardcode farmer-facing copy in components.
- **TypeScript:** No `any`, `as any`, or `as unknown as`.

**Placement:** `services/<feature>/`, `data/<feature>.ts`, `routes/**`, shared UI in `components/`, providers in `providers/`.

**Where to see it in code:**

| Pattern                                               | File                                                       |
| ----------------------------------------------------- | ---------------------------------------------------------- |
| `apiClient`, `APIError`, Problem Details typing       | `frontend/src/services/apiClient.ts`                       |
| Feature service: `ky` + typed `.json()`               | `frontend/src/services/soil-profile/soilProfileService.ts` |
| Request/response TypeScript models                    | `frontend/src/services/soil-profile/models.ts`             |
| React Query `queryOptions` / hooks / mutations        | `frontend/src/data/soilProfile.ts`                         |
| Router context (`queryClient`, `auth`)                | `frontend/src/routes/__root.tsx`                           |
| Loader catches `APIError` / `notFound()`              | `frontend/src/routes/(app)/soils/$soilId/index.tsx`        |
| `searchParams` on GET (simple object form)            | `frontend/src/services/geocoding/geocodingService.ts`      |
| `PaginatedResponse<T>` (`{ count; items }`)           | `frontend/src/services/apiClient.ts`                       |
| Typed env (use `env`, not `import.meta.env` directly) | `frontend/src/env.ts`                                      |

### Filtering and pagination (service layer)

Optional filters or paging: build a `URLSearchParams` in the feature service, add only the keys you need, and call `apiClient.get(path, { searchParams }).json()`. Define a request param and response shapes in that feature’s `models.ts`.

List endpoints that return `{ count, items }` should be typed as `PaginatedResponse<T>` from `@/services/apiClient` with the right item type `T`. If the JSON shape differs, define a matching type in `models.ts` instead.

---

## Verification (when asked)

- Frontend (`frontend/`): `npm run lint && npm run format:check && npm run build`
- Backend (`backend/`): `./mvnw verify`

If **lint or formatting** fails, from `frontend/` run **`npm run format`** — it runs ESLint with `--fix` and Prettier write and fixes most style issues in one step. Then re-run lint/format check as needed.

Do not suppress real errors with casts or overrides to pass CI.

---

## Tests

Do not add tests unless explicitly requested.

---

## Do not

- Add AI model logic to this repo.
- Return entities from controllers (use DTOs).
- Import repositories from `web`.
- Bypass `apiClient` for HTTP.
- Use `any` / unsafe casts to silence TypeScript.

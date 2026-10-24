# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This monorepo holds two independent apps, each with its own `package.json`, `node_modules` and lint config. There is no root `package.json`: run npm commands from inside the app folder.

- `office-api/`: the NestJS 9 HTTP API (port 3000, Swagger at `/api`). MySQL via Prisma, an in-memory cache, AWS S3 + CloudFront for files, e-mail notifications via Nodemailer.
- `office-web/`: Next.js 13 (App Router) front-end, dev server on port 3333. See the `office-web` section below.

There used to be two more NestJS services (`office-project-posts` on MongoDB and `office-notifications`) talking to the API over Kafka. They became modules of `office-api` (`app/project-post/`, `providers/notifications/`), so there is no Kafka, MongoDB or Redis anymore.

The standalone `office-web` repository (Vite + React) is an older prototype; the current front-end is the `office-web/` folder here.

## Commands

The only infrastructure is MySQL, from the repo root:

```bash
docker compose up -d
```

The compose project name is pinned (`name: offices-api`), so this works from any checkout or worktree and always reaches the same containers. MySQL data lives in the Docker volume `offices-api-mysql-data`, not in the repo folder, so it survives `docker compose down`. `docker compose down -v` wipes it.

`office-api` reads a `.env` in its folder; copy it from `office-api/.env.example`. AWS and email values are only needed for uploads and email notifications. No seed is needed: signing up an office creates its default job titles and its OWNER.

Inside `office-api/`:

```bash
npm install
npm run start:dev          # watch mode
npm run build
npm run lint               # eslint --fix
npm run format             # prettier
npm run test               # jest, matches src/**/*.spec.ts
npx jest path/to/file.spec.ts   # single test file
npm run test:e2e           # test/jest-e2e.json
```

There are currently no unit tests, only the scaffolded e2e spec.

Prisma (inside `office-api/`, schema at `prisma/schema.prisma`, connects with `MYSQL_URI`):

```bash
npx prisma migrate dev --name <snake_case_description>
npx prisma generate
```

## Environment variables

No `.env` is committed (see each app's `.env.example`). `office-api` has no config loader of its own: its `.env` reaches `process.env` only because importing `@prisma/client` loads it. Variables read via `process.env`: `PORT` (default 3000), `MYSQL_URI`, `SECRET` (JWT), `AWS_BUCKET`, `AWS_CLOUDFRONT_DNS`, `AWS_CLOUDFRONT_KEYPAIR_ID`, `AWS_CLOUDFRONT_KEY_GROUP_ID`, `AWS_CLOUDFRONT_KEY_PATH`, `EMAIL`, `EMAIL_PASSWORD`, `EMAIL_PROVIDER`. Without `EMAIL`/`EMAIL_PASSWORD`, e-mail notifications are only logged.

## office-api architecture

Feature modules live in `src/app/<feature>/` and follow a fixed layout:

- `<feature>.controller.ts`: thin; pulls `office_id`/`employee_id` from `req.user` and delegates to one use case per endpoint.
- `usecases/<verb>-<noun>.usecase.ts`: one `@Injectable()` class per action with a single `execute(...)` method holding the business logic and authorization checks (e.g. verifying a project's `client.office_id` matches the caller's `office_id`, throwing `UnauthorizedException` otherwise). Sub-areas get subfolders (`project/usecases/steps/`).
- `<feature>.repository.ts`: an `abstract class XRepository` (used as the DI token) plus an `XRepositorySQL` Prisma implementation in the same file.
- `dtos/`: `class-validator` DTOs; the global `ValidationPipe` runs with `transform: true`.

Files (project files, logos, avatars) go through `StorageService` (`src/providers/storage/`, bound to S3). The database stores only the storage **key** (e.g. `offices/<id>/clients/<id>/projects/<id>/files/<uuid>.pdf`); `signFile()` turns it into a CloudFront signed URL valid for 30 minutes, and also accepts legacy rows holding the full S3 URL. Project files upload in batches straight to S3:
1. `POST /project-files/uploads` returns one presigned PUT URL per file, valid for 15 minutes. The browser must send the returned `content_type` as the `Content-Type` header.
2. `POST /project-files/batch` confirms the batch and saves the rows in one transaction. It checks that every key is under the project's prefix and exists in S3, creates the folders of each file's `relative_path`, and renames duplicates to `name (1).ext`.

The limits are 100 files per batch and 5GB per file. The browser PUT needs a CORS rule on the bucket, which currently allows `PUT` from `http://localhost:3333` only.

Logos and avatars still send base64/data URLs inside the JSON body (`decodeBase64` strips a `data:` prefix). The body limit is 20MB (`main.ts`).

**All repositories are registered and exported centrally in `src/database/database.module.ts`** (`{ provide: XRepository, useClass: XRepositorySQL }`). Adding a repository means adding it there, and feature modules import `DatabaseModule` to get it. Storage works the same way: abstract `StorageService` bound to `S3StorageService` in `src/providers/storage/`.

Use cases can be reused across modules (e.g. `project` imports `ProjectStepModule` to use `CreateProjectStepUsecase`); the owning module must export it.

Mutation endpoints return `BaseResponse` (`{ success, message }`) from `src/app/common/dtos/responses.ts`.

### Multi-tenancy and auth

Everything is scoped to an **office**. There are two separate Passport JWT flows in `src/auth/`, both signed with `SECRET` and told apart by the token `aud` claim:

- `auth/employee/`: `JwtAuthGuard` (`aud: 'employee'`), `req.user = { employee_id, office_id, email, access_level }` (type `OfficeRequest`).
  - `JwtStrategy` reloads the employee's `access_level` and `is_active` on each request, with a 30s cache under `auth-employee-<id>`. Inactivation and access-level changes apply immediately; call `invalidateEmployeeAuth` after changing either.
  - `GET /auth/me` returns the employee, their office and their permission list.
- `auth/client/`: `ClientJwtAuthGuard` (strategy name `client-jwt`, `aud: 'client'`), `req.user = { client_id, office_id, email }`. It also **injects `client_id` into `request.query`**, so client-facing list endpoints filter by the caller automatically.

Both strategies reject requests whose `office_id` in body or params differs from the token's.

**Permissions.** Each employee has an `access_level`: `OWNER` (exactly one per office), `PARTNER` or `MEMBER`. `Role` is only a job title and grants nothing.
- Endpoints check named permissions, never levels: `@UseGuards(JwtAuthGuard, PermissionsGuard)` plus `@RequirePermission(Permission.X)` (`auth/employee/permissions*.ts`). A failed check returns 403.
- The level → permission map is `ACCESS_LEVEL_PERMISSIONS`:
  - PARTNER can manage the office, employees, job titles, step templates and file categories, inactivate clients and delete anyone's files;
  - OWNER can do all of that and also grant or revoke PARTNER;
  - MEMBER works on clients, projects, steps and their own files.
- Rules that depend on the target live in the use cases (`app/employee/employee-rules.ts`): nobody acts on themselves (that's `/employees/me`) or on the OWNER, and only the OWNER acts on a PARTNER. Client-facing routes are usually separate endpoints (e.g. `GET /projects/clients`) rather than shared ones.

### Caching

The global `CacheModule` keeps entries in memory, per process. It is used by hand in controllers: `cacheManager.get` then `set` with keys like `project-${office_id}-${project_id}` and short TTLs. **Pass the TTL as `{ ttl: seconds }`**: a bare number is also read as seconds, so `5000` would mean 83 minutes. Few keys are invalidated on writes (`invalidateProjectsCache`, `invalidateEmployeeAuth`), so reads can be stale for the TTL. Being in memory, the cache only works with a single API instance.

### Data model

Prisma models in `prisma/schema.prisma`: Office → Clients, Employees (with an optional Role and an `access_level`), Roles (unique label per office), Categories, Steps; Client → Projects; Project → ProjectFiles (with Category), ProjectFolders, ProjectSteps (unique on `project_id` + `step_id`) and ProjectPosts → ProjectPostLikes (one per client and post). `ProjectFolder` is a per-project tree of any depth (`parent_id` null = root). A file's `folder_id` places it in the tree, while its category and step are only tags. A folder's own category and step are the default tags for files uploaded into it. `Step` is an office-level template; `ProjectStep` is that step's instance/status on a project. IDs are UUID strings.

## Notifications and the project feed

Both used to be separate services reached over Kafka; they are now plain modules of `office-api`.

- `providers/notifications/`: `NotificationsService.notify({ type, receiver, content })`, with `type` `CONSOLE` (only logs) or `EMAIL` (Nodemailer). It never throws, and callers don't await it, so a failed notification never fails the action that triggered it.
- `app/project-post/`: the project feed. Employees post (`POST /projects/posts`, text and/or one base64 media stored under `.../projects/<id>/posts/<post_id>/media.<ext>`); the project's client reads it (`GET /projects/feed/:project_id`, with signed media URLs, like counts and `liked`) and likes it (`POST /projects/posts/like` and `/unlike`). The caller always comes from the token. Creating a post e-mails the client, and a like e-mails the post's author. The feed is not cached. Nothing in `office-web` uses it yet.

## office-web architecture

Next.js 13.3 with the `app/` directory, Tailwind and Radix UI, with zod for form validation. The UI is in Brazilian Portuguese. Commands: `npm run dev` (port 3333; not `--turbo`, which in 13.3.4 breaks client components imported by the root layout), `npm run build`, `npm run lint`.

- Routes: `app/page.tsx` is sign-in/sign-up (create an office). `app/(portal)/` holds the logged-in pages (projects, `projects/[project_id]`, clients, employees, roles, categories, steps) and shares a Header + Sidebar layout.
- Project files: `app/components/Project/Files/FileExplorer.tsx` is a Drive-like explorer (the open folder is in `?folder=`).
  - Batch uploads go through `app/hooks/useUploadQueue.ts`: presign, then XHR PUT to S3 with progress, then a batch confirm.
  - Files and whole folders can be picked or dropped.
  - Category and step filters search every folder.
- API calls: one function per endpoint under `app/lib/api/office-api/<resource>/` (e.g. `list-projects.ts`), each using the shared axios instance `OfficeAPI` (`app/lib/api/office-api/index.ts`, base URL from `NEXT_PUBLIC_API_URL`, default `http://localhost:3000`) and passing the token as a `Bearer` header. Response types are hand-written in `dtos.ts` next to them; they mirror the Prisma models and must be kept in sync by hand.
- Auth: `app/contexts/UserContext.tsx` (used through `useUser()`) logs in via `POST /auth/login` and stores `{ access_token, office_id, email }` in a `user` cookie (`cookies-next`, 1 day). Pages call `getCurrentUser()` and render `UnauthorizedPage` when it returns null. Only the employee login flow is wired up in the UI.
- Imports use the `@/app/...` alias.
- **Mobile-first, always.** Offices and their clients use the portal on phones.
  - Base styles target the phone, `md:` (768) the tablet and `lg:` (1024) the desktop.
  - The `(portal)` shell gives phones and tablets a header, a bottom tab bar (`components/Navigation/BottomNav.tsx`) and a menu drawer (`MenuDrawer.tsx`). From `lg` up it shows the sidebar instead. All three read the same `components/Navigation/nav-items.tsx`.
  - Use the shared pieces:
    - `PageHeader` with an `ActionLabel` trigger for the page's main action, which becomes a floating + button on phones;
    - `DataList` instead of tables (cards below `md`);
    - `Modal`, a bottom sheet on phones.
  - Rules:
    - no fixed widths over ~360px without a breakpoint;
    - touch targets of at least 44px;
    - no hover-only actions or information.
  - Inputs get 16px text on phones (`globals.css`) so iOS doesn't zoom.
  - Check every screen at 375, 768 and 1280px wide, with no horizontal scroll.

## Conventions

- Imports use absolute `src/...` paths (resolved via `baseUrl` in tsconfig) as well as relative ones.
- Prettier: single quotes, trailing commas.
- Database columns and DTO fields are `snake_case`; classes are `PascalCase` with suffixes `Usecase`, `Repository`/`RepositorySQL`, `DTO`.
- Commit messages use a `feat:` / `wip:` prefix.

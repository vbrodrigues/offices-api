# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This monorepo holds four independent apps, each with its own `package.json`, `node_modules` and lint config. There is no root `package.json`: run npm commands from inside the app folder.

- `office-api/`: the main NestJS 9 HTTP API (port 3000, Swagger at `/api`). MySQL via Prisma, Redis cache, AWS S3 + CloudFront for files, Kafka producer.
- `office-project-posts/`: NestJS project posts/likes/feed service (HTTP on port 3001 plus a Kafka consumer). MongoDB via Mongoose.
- `office-notifications/`: NestJS Kafka-only microservice (no HTTP) that sends notifications (console or email via Nodemailer).
- `office-web/`: Next.js 13 (App Router) front-end, dev server on port 3333. See the `office-web` section below.

The standalone `office-web` repository (Vite + React) is an older prototype; the current front-end is the `office-web/` folder here.

## Commands

Infrastructure (Kafka in KRaft mode, MySQL, Redis, MongoDB) from the repo root:

```bash
docker compose up -d
```

Each backend app reads a `.env` in its own folder; copy it from the `.env.example` next to it. AWS and email values are only needed for uploads and email notifications. A fresh database needs a `Role` row with label `owner` before an office can sign up (no seed exists).

Per NestJS service (`cd office-api`, etc.):

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

No `.env` is committed (see each app's `.env.example`). `office-api` has no config loader of its own: its `.env` reaches `process.env` only because importing `@prisma/client` loads it. Variables read via `process.env`: `MYSQL_URI`, `MONGO_URI`, `REDIS_HOST`, `REDIS_PORT`, `SECRET` (JWT), `PROJECT_POSTS_SERVICE_URL` (office-api → project-posts HTTP), `AWS_BUCKET`, `AWS_CLOUDFRONT_DNS`, `AWS_CLOUDFRONT_KEYPAIR_ID`, `AWS_CLOUDFRONT_KEY_GROUP_ID`, `AWS_CLOUDFRONT_KEY_PATH`, `EMAIL`, `EMAIL_PASSWORD`, `EMAIL_PROVIDER`. Kafka brokers are hard-coded to `localhost:9092`.

## office-api architecture

Feature modules live in `src/app/<feature>/` and follow a fixed layout:

- `<feature>.controller.ts`: thin; pulls `office_id`/`employee_id` from `req.user` and delegates to one use case per endpoint.
- `usecases/<verb>-<noun>.usecase.ts`: one `@Injectable()` class per action with a single `execute(...)` method holding the business logic and authorization checks (e.g. verifying a project's `client.office_id` matches the caller's `office_id`, throwing `UnauthorizedException` otherwise). Sub-areas get subfolders (`project/usecases/posts/`, `project/usecases/steps/`).
- `<feature>.repository.ts`: an `abstract class XRepository` (used as the DI token) plus an `XRepositorySQL` Prisma implementation in the same file.
- `dtos/`: `class-validator` DTOs; the global `ValidationPipe` runs with `transform: true`.

Files (project files, logos, avatars) go through `StorageService` (`src/providers/storage/`, bound to S3). The database stores only the storage **key** (e.g. `offices/<id>/clients/<id>/projects/<id>/files/<uuid>.pdf`); `signFile()` turns it into a CloudFront signed URL valid for 30 minutes, and also accepts legacy rows holding the full S3 URL. Uploads arrive as base64/data URL inside the JSON body (`decodeBase64` strips a `data:` prefix), so the practical limit is ~380MB per file.

**All repositories are registered and exported centrally in `src/database/database.module.ts`** (`{ provide: XRepository, useClass: XRepositorySQL }`). Adding a repository means adding it there, and feature modules import `DatabaseModule` to get it. Storage works the same way: abstract `StorageService` bound to `S3StorageService` in `src/providers/storage/`.

Use cases can be reused across modules (e.g. `project` imports `ProjectStepModule` to use `CreateProjectStepUsecase`); the owning module must export it.

Mutation endpoints return `BaseResponse` (`{ success, message }`) from `src/app/common/dtos/responses.ts`.

### Multi-tenancy and auth

Everything is scoped to an **office**. There are two separate Passport JWT flows in `src/auth/`, both signed with `SECRET` and told apart by the token `aud` claim:

- `auth/employee/`: `JwtAuthGuard` (`aud: 'employee'`), `req.user = { employee_id, office_id, email }` (type `OfficeRequest`).
- `auth/client/`: `ClientJwtAuthGuard` (strategy name `client-jwt`, `aud: 'client'`), `req.user = { client_id, office_id, email }`. It also **injects `client_id` into `request.query`**, so client-facing list endpoints filter by the caller automatically.

Both strategies reject requests whose `office_id` in body or params differs from the token's. Client-facing routes are usually separate endpoints (e.g. `GET /projects/clients`) rather than shared ones.

### Caching

The global Redis `CacheModule` is used by hand in controllers: `cacheManager.get` then `set` with keys like `project-${office_id}-${project_id}` and short TTLs (5–15s). Nothing invalidates these keys on writes, so reads can be stale for the TTL.

### Data model

Prisma models in `prisma/schema.prisma`: Office → Clients, Employees (with Role), Categories, Steps; Client → Projects; Project → ProjectFiles (with Category) and ProjectSteps (unique on `project_id` + `step_id`). `Step` is an office-level template; `ProjectStep` is that step's instance/status on a project. IDs are UUID strings.

## Inter-service communication

`office-api` talks to the other services through `src/events/`:

- `events/notifications/`: `NotificationsService.notify()` sends to Kafka topic `office-notifications`. `office-notifications` handles it in `AppController` via `@MessagePattern`, and `NotificationServiceFactory` picks a sender (and message converter) by `data.type` (`CONSOLE` | `EMAIL`; `SMS` is declared but not implemented).
- `events/project-posts/`: `ProjectPostsService` sends `office-create-project-post`, `office-like-project-post` and `office-unlike-project-post`, handled by `@MessagePattern`s in `office-project-posts/src/project-post/project-post.controller.ts`.
- Reads go over **HTTP**, not Kafka: `GetProjectFeedUsecase` calls `GET /project-posts/feed/:project_id` on `office-project-posts` through the axios client in `src/app/common/utils/http-client.ts` (`PROJECT_POSTS_SERVICE_URL`).

These use Kafka request/response (`ClientKafka.send` + `subscribeToResponseOf`), so the consumer must return a value. Adding a topic means updating `subscribeToResponseOf` on the producer and adding the `@MessagePattern` on the consumer. DTOs for these messages are duplicated by hand in each service (e.g. `office-api/src/events/*/…dto.ts` and `office-project-posts/src/**/dtos`); keep them in sync.

`office-project-posts` uses the same use case / repository layout, with Mongoose models in `src/database/nosql/models.ts` reached through `MongoDBService`.

## office-web architecture

Next.js 13.3 with the `app/` directory, Tailwind, Radix UI and Mantine, with zod for form validation. The UI is in Brazilian Portuguese. Commands: `npm run dev` (port 3333, `--turbo`), `npm run build`, `npm run lint`.

- Routes: `app/page.tsx` is sign-in/sign-up (create an office). `app/(portal)/` holds the logged-in pages (projects, `projects/[project_id]`, clients, employees, roles, categories, steps) and shares a Header + Sidebar layout.
- API calls: one function per endpoint under `app/lib/api/office-api/<resource>/` (e.g. `list-projects.ts`), each using the shared axios instance `OfficeAPI` (`app/lib/api/office-api/index.ts`, hard-coded `http://localhost:3000`) and passing the token as a `Bearer` header. Response types are hand-written in `dtos.ts` next to them; they mirror the Prisma models and must be kept in sync by hand.
- Auth: `app/contexts/UserContext.tsx` (used through `useUser()`) logs in via `POST /auth/login` and stores `{ access_token, office_id, email }` in a `user` cookie (`cookies-next`, 1 day). Pages call `getCurrentUser()` and render `UnauthorizedPage` when it returns null. Only the employee login flow is wired up in the UI.
- Imports use the `@/app/...` alias.

## Conventions

- Imports use absolute `src/...` paths (resolved via `baseUrl` in tsconfig) as well as relative ones.
- Prettier: single quotes, trailing commas.
- Database columns and DTO fields are `snake_case`; classes are `PascalCase` with suffixes `Usecase`, `Repository`/`RepositorySQL`, `DTO`.
- Commit messages use a `feat:` / `wip:` prefix.

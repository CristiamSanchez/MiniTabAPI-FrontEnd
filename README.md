# MiniTask

MiniTask is a full-stack task management application built with a .NET API, PostgreSQL, React, and Angular.

The project demonstrates how two independent frontend applications can consume the same backend and database while using their own architecture, state management, forms, styling, and development tools.

The Git history preserves the incremental construction of the project through small, verifiable phases.

## Features

### Task management

- Create tasks.
- View all tasks.
- Edit task information.
- Assign tasks to categories.
- Set optional descriptions and due dates.
- Mark tasks as completed.
- Reopen completed tasks.
- Delete tasks with confirmation.

### Category management

- Create categories.
- View all categories.
- Rename categories.
- Delete unused categories.
- Prevent deletion when a category contains tasks.
- Synchronize renamed categories with displayed tasks.

### Frontend experience

Both frontend applications provide:

- Responsive layouts.
- Client-side form validation.
- Loading, empty, success, and error states.
- API connection status.
- Immediate state updates without page reloads.
- Backend validation messages.
- Shared data through the same API and PostgreSQL database.

The Angular frontend additionally includes:

- Reactive Forms.
- Signals and computed state.
- Modern `@if` and `@for` control flow.
- Persistent light and dark themes.
- System theme detection.
- Theme preference stored in `localStorage`.

## Technology stack

### Backend

- .NET 10
- ASP.NET Core Web API
- Entity Framework Core 10
- PostgreSQL 17
- xUnit
- Docker Compose

### React frontend

- React 19
- TypeScript 6
- Vite 8
- Oxlint
- CSS

### Angular frontend

- Angular 22
- Angular CLI 22
- TypeScript 6
- RxJS
- Reactive Forms
- Signals
- Vitest
- CSS

## Repository structure

```text
MiniTask/
├── src/
│   ├── MiniTask.Domain/
│   ├── MiniTask.Application/
│   ├── MiniTask.Infrastructure/
│   └── MiniTask.API/
├── tests/
│   ├── MiniTask.Domain.Tests/
│   └── MiniTask.Application.Tests/
├── frontend-react/
├── frontend-angular/
├── docker-compose.yml
├── MiniTask.slnx
└── README.md
```

## Backend architecture

The backend follows Clean Architecture principles.

- `Domain`: entities, state transitions, and business rules.
- `Application`: use cases, repository contracts, requests, responses, and application exceptions.
- `Infrastructure`: Entity Framework Core, PostgreSQL, migrations, and repository implementations.
- `API`: HTTP controllers, dependency configuration, CORS, and status-code mapping.
- `Tests`: unit tests for domain behavior and application services.

Dependencies point inward toward the domain and application rules.

## Main data model

MiniTask uses two related entities:

```text
TaskCategory
└── TaskItem
```

A category can contain multiple tasks. Every task belongs to one category.

Category deletion uses a restricted relationship. A category containing tasks cannot be deleted, preventing accidental loss of related data.

## API endpoints

### Categories

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/categories` | Get all categories |
| `GET` | `/api/categories/{id}` | Get a category |
| `POST` | `/api/categories` | Create a category |
| `PUT` | `/api/categories/{id}` | Update a category |
| `DELETE` | `/api/categories/{id}` | Delete an unused category |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Get all tasks |
| `GET` | `/api/tasks/{id}` | Get a task |
| `POST` | `/api/tasks` | Create a task |
| `PUT` | `/api/tasks/{id}` | Update a task |
| `PATCH` | `/api/tasks/{id}/complete` | Complete a task |
| `PATCH` | `/api/tasks/{id}/reopen` | Reopen a task |
| `DELETE` | `/api/tasks/{id}` | Delete a task |

## HTTP behavior

| Status | Meaning |
|---|---|
| `200 OK` | Successful query or update |
| `201 Created` | Resource created |
| `204 No Content` | Resource deleted |
| `400 Bad Request` | Invalid input |
| `404 Not Found` | Resource does not exist |
| `409 Conflict` | Duplicate data, invalid transition, or category in use |

## Requirements

Install:

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Docker](https://docs.docker.com/get-docker/)
- [Node.js](https://nodejs.org/) through NVM
- Git

The repository contains an `.nvmrc` file with the Node.js version used during development.

## Local setup

### 1. Clone the repository

```bash
git clone https://github.com/CristiamSanchez/MiniTabAPI-FrontEnd.git
cd MiniTabAPI-FrontEnd
```

### 2. Select the Node.js version

```bash
nvm install
nvm use
```

### 3. Configure PostgreSQL

Copy the root environment template:

```bash
cp .env.example .env
```

Replace the example values with local development credentials.

Do not commit `.env`.

### 4. Configure the API connection

Create:

```text
src/MiniTask.API/appsettings.Development.json
```

Example:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "Database": "Host=localhost;Port=YOUR_POSTGRES_PORT;Database=minitask_db;Username=minitask_user;Password=YOUR_LOCAL_PASSWORD"
  }
}
```

The port and credentials must match `.env`.

This file is ignored by Git and must only contain local development credentials.

## Run the application

The API and selected frontend must run in separate terminals.

### Terminal 1: PostgreSQL and API

From the repository root:

```bash
docker compose up -d
dotnet run --project src/MiniTask.API
```

API address:

```text
http://localhost:5281
```

OpenAPI document:

```text
http://localhost:5281/openapi/v1.json
```

### Terminal 2: React

Install dependencies the first time:

```bash
npm --prefix frontend-react install
```

Create the local React environment:

```bash
cp frontend-react/.env.example \
  frontend-react/.env.development.local
```

Run React:

```bash
npm --prefix frontend-react run dev
```

React address:

```text
http://localhost:5173
```

### Terminal 2: Angular

Install dependencies the first time:

```bash
npm --prefix frontend-angular install
```

Run Angular:

```bash
npm --prefix frontend-angular start
```

Angular address:

```text
http://localhost:4200
```

React and Angular can also run simultaneously because they use different ports.

The API CORS policy allows both development origins.

## Database migrations

Apply migrations with:

```bash
dotnet ef database update \
  --project src/MiniTask.Infrastructure \
  --startup-project src/MiniTask.API
```

## Build and test

### Backend

```bash
dotnet build MiniTask.slnx
dotnet test MiniTask.slnx
```

Current backend test suite:

```text
29 tests passed
```

### React

```bash
npm --prefix frontend-react run lint
npm --prefix frontend-react run build
```

### Angular

```bash
npm --prefix frontend-angular run build
npm --prefix frontend-angular test -- --watch=false
```

## Stop local services

Stop a development server with:

```text
Ctrl+C
```

Stop PostgreSQL without removing stored data:

```bash
docker compose down
```

Do not use `docker compose down -v` unless you intentionally want to delete the PostgreSQL volume.

## Development approach

MiniTask was intentionally developed through small, complete iterations:

1. Domain entities and business rules.
2. EF Core persistence and PostgreSQL.
3. Category API operations.
4. Task API operations.
5. Domain and application tests.
6. React base layout.
7. React API integration.
8. React task CRUD.
9. React category management.
10. Angular project initialization.
11. Angular API integration.
12. Angular task CRUD.
13. Angular category management.
14. Angular persistent dark mode.
15. Documentation and validation.

Each phase was built, tested, committed, and pushed independently to preserve the evolution of the project.

## Security notes

- Local secrets are excluded from Git.
- `.env` must never be committed.
- `appsettings.Development.json` is ignored.
- Example configuration files contain placeholders only.
- Database credentials in this repository are intended for local development, not production.

## Frontend documentation

Additional frontend-specific instructions are available in:

- [`frontend-react/README.md`](frontend-react/README.md)
- [`frontend-angular/README.md`](frontend-angular/README.md)
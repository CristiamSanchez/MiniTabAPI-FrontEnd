# MiniTask

MiniTask is a full-stack task management application built to demonstrate the progressive development of a modern web application using .NET, React, PostgreSQL, Docker, and Clean Architecture.

The repository preserves an incremental Git history showing how the backend and frontend were implemented in small, verifiable phases.

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
- Synchronize renamed categories with the displayed tasks.

### User interface

- Responsive React interface.
- Loading, empty, success, and error states.
- API connection status.
- Forms with client-side validation.
- Immediate state updates without page reloads.
- Backend validation messages displayed to the user.

## Technology stack

### Backend

- .NET 10
- ASP.NET Core Web API
- Entity Framework Core 10
- PostgreSQL 17
- xUnit
- Docker Compose

### Frontend

- React 19
- TypeScript 6
- Vite 8
- Oxlint
- CSS

## Architecture

The backend follows Clean Architecture principles:

```text
src/
├── MiniTask.Domain/
├── MiniTask.Application/
├── MiniTask.Infrastructure/
└── MiniTask.API/

tests/
├── MiniTask.Domain.Tests/
└── MiniTask.Application.Tests/
```

Responsibilities:

- `Domain`: entities and business rules.
- `Application`: use cases, contracts, requests, responses, and application exceptions.
- `Infrastructure`: Entity Framework Core, PostgreSQL, migrations, and repository implementations.
- `API`: HTTP controllers, application configuration, CORS, and status-code mapping.
- `Tests`: unit tests for domain behavior and application services.

The React application is located in:

```text
frontend-react/
```

A future Angular implementation can be added as:

```text
frontend-angular/
```

This will allow both frontend approaches to consume the same .NET API.

## Main data model

MiniTask currently uses two related entities:

```text
TaskCategory
└── TaskItem
```

A category can contain multiple tasks, while each task belongs to one category.

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

The API uses meaningful status codes:

| Status | Meaning |
|---|---|
| `200 OK` | Successful query or update |
| `201 Created` | Resource created |
| `204 No Content` | Resource deleted |
| `400 Bad Request` | Invalid input |
| `404 Not Found` | Resource does not exist |
| `409 Conflict` | Duplicate data, invalid state transition, or category in use |

## Requirements

Install the following tools:

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Docker](https://docs.docker.com/get-docker/)
- [Node.js](https://nodejs.org/) through NVM
- Git

The repository includes an `.nvmrc` file with the Node.js version used during development.

## Local configuration

### 1. Clone the repository

```bash
git clone https://github.com/CristiamSanchez/MiniTabAPI-FrontEnd.git
cd MiniTabAPI-FrontEnd
```

### 2. Configure PostgreSQL

Copy the environment template:

```bash
cp .env.example .env
```

Open `.env` and replace the example password with a local development password.

Do not commit `.env`.

### 3. Configure the API connection string

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

The port and credentials must match the values configured in `.env`.

This file is ignored by Git and must not contain credentials used outside local development.

## Run PostgreSQL

From the repository root:

```bash
docker compose up -d
```

Verify the container:

```bash
docker compose ps
```

To stop PostgreSQL without deleting its data:

```bash
docker compose down
```

Do not use `docker compose down -v` unless you intentionally want to delete the database volume.

## Apply database migrations

```bash
dotnet ef database update \
  --project src/MiniTask.Infrastructure \
  --startup-project src/MiniTask.API
```

## Run the API

```bash
dotnet run --project src/MiniTask.API
```

Default development address:

```text
http://localhost:5281
```

OpenAPI document:

```text
http://localhost:5281/openapi/v1.json
```

## Run the React frontend

Install the configured Node.js version:

```bash
nvm install
nvm use
```

Install dependencies:

```bash
cd frontend-react
npm install
```

Create the local frontend environment:

```bash
cp .env.example .env.development.local
```

Run the development server:

```bash
npm run dev
```

Default address:

```text
http://localhost:5173
```

The API contains a CORS policy allowing this development origin.

## Build and validation

### Backend

```bash
dotnet build MiniTask.slnx
dotnet test MiniTask.slnx
```

Current automated test suite:

```text
29 tests passed
```

### Frontend

From the repository root:

```bash
npm --prefix frontend-react run lint
npm --prefix frontend-react run build
```

## Development approach

MiniTask was intentionally developed through small, complete iterations:

1. Domain entities and business rules.
2. Persistence with EF Core and PostgreSQL.
3. Category API operations.
4. Task API operations.
5. Domain and application tests.
6. CORS configuration.
7. React and TypeScript initialization.
8. API data loading.
9. Task creation, editing, state transitions, and deletion.
10. Category creation, editing, and protected deletion.

This incremental history is preserved in Git so each development phase can be inspected independently.

## Future improvements

- Angular frontend using the same API.
- Task filtering and searching.
- Pagination.
- Authentication and authorization.
- Frontend automated tests.
- Integration tests.
- Global API exception handling.
- Structured logging with Serilog.
- Continuous integration with GitHub Actions.
- Production deployment.

## Repository

[MiniTabAPI-FrontEnd](https://github.com/CristiamSanchez/MiniTabAPI-FrontEnd)
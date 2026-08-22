# MiniTask Angular

Angular frontend for the MiniTask task management application.

This application consumes the MiniTask .NET API and shares the same PostgreSQL database used by the React frontend.

## Features

### Tasks

- Load tasks from the API.
- Create tasks with Reactive Forms.
- Edit task information.
- Select a category.
- Add optional descriptions and due dates.
- Complete and reopen tasks.
- Delete tasks with confirmation.
- Update the interface without reloading.

### Categories

- Load categories from the API.
- Create categories.
- Rename categories.
- Delete unused categories.
- Display backend conflicts when a category contains tasks.
- Synchronize renamed categories with tasks and forms.

### Interface

- Responsive teal and orange design.
- Loading, empty, success, and error states.
- API connection indicator.
- Client-side validation.
- Persistent light and dark modes.
- System theme detection.
- Theme preference stored in `localStorage`.

## Technology stack

- Angular 22
- Angular CLI 22
- TypeScript 6
- RxJS
- Angular HttpClient
- Reactive Forms
- Signals and computed state
- Modern `@if` and `@for` syntax
- Vitest
- CSS

## Project structure

```text
src/
├── app/
│   ├── core/
│   │   ├── models/
│   │   │   ├── task-category.ts
│   │   │   └── task-item.ts
│   │   └── services/
│   │       ├── task-category.service.ts
│   │       ├── task-item.service.ts
│   │       └── theme.service.ts
│   ├── features/
│   │   ├── categories/
│   │   │   └── category-manager/
│   │   └── tasks/
│   │       └── task-form/
│   ├── app.config.ts
│   ├── app.html
│   ├── app.css
│   ├── app.spec.ts
│   └── app.ts
├── environments/
│   ├── environment.ts
│   └── environment.development.ts
├── index.html
├── main.ts
└── styles.css
```

## Main Angular concepts

### Services

HTTP communication is isolated in services:

- `TaskItemService`
- `TaskCategoryService`

The components do not construct API URLs directly.

### Signals

The application uses signals for frontend state, including:

- Tasks.
- Categories.
- Loading state.
- API errors.
- Selected task for editing.
- Task operations.
- Current color theme.

### Reactive Forms

Reactive Forms provide:

- Required-field validation.
- Maximum-length validation.
- Create and edit modes.
- Disabled submission states.
- API error feedback.

### Component communication

Feature components receive data through signal inputs and notify `App` through outputs.

Examples:

- `TaskForm` emits created and updated tasks.
- `CategoryManager` emits created, updated, and deleted categories.

### Theme service

`ThemeService`:

- Detects the operating-system theme.
- Applies `data-theme` to the root HTML element.
- Switches between light and dark mode.
- Stores the selected theme in `localStorage`.

Storage key:

```text
minitask-angular-theme
```

## Requirements

Use the Node.js version configured in the repository root:

```bash
nvm install
nvm use
```

Install Angular dependencies from the repository root:

```bash
npm --prefix frontend-angular install
```

Alternatively, from this directory:

```bash
npm install
```

## API configuration

Development API configuration is located in:

```text
src/environments/environment.development.ts
```

Default API address:

```text
http://localhost:5281
```

The production configuration is located in:

```text
src/environments/environment.ts
```

Do not place passwords or private credentials in Angular environment files. Browser applications cannot securely hide embedded secrets.

## Run locally

### API

From the repository root:

```bash
docker compose up -d
dotnet run --project src/MiniTask.API
```

### Angular

From the repository root:

```bash
npm --prefix frontend-angular start
```

Or from `frontend-angular/`:

```bash
npm start
```

Open:

```text
http://localhost:4200
```

## Production build

From the repository root:

```bash
npm --prefix frontend-angular run build
```

Build output:

```text
frontend-angular/dist/minitask-angular/
```

## Unit tests

From the repository root:

```bash
npm --prefix frontend-angular test -- --watch=false
```

Or from `frontend-angular/`:

```bash
npm test -- --watch=false
```

Tests use Vitest through the Angular build system.

## Angular CLI

Generate a component from `frontend-angular/`:

```bash
npx ng generate component features/example/example-component
```

Generate a service:

```bash
npx ng generate service core/services/example
```

## Development addresses

| Service | Address |
|---|---|
| MiniTask API | `http://localhost:5281` |
| Angular frontend | `http://localhost:4200` |
| React frontend | `http://localhost:5173` |

## Related documentation

See the root [`README.md`](../README.md) for:

- Backend architecture.
- PostgreSQL configuration.
- Docker instructions.
- API endpoints.
- React instructions.
- Complete project setup.
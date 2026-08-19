# MiniTask React Frontend

React and TypeScript frontend for the MiniTask task management application.

This application consumes the MiniTask ASP.NET Core API and provides a responsive interface for managing tasks and categories.

For complete backend, database, and project setup instructions, see the [main README](../README.md).

## Technologies

- React 19
- TypeScript 6
- Vite 8
- Oxlint
- CSS
- Browser Fetch API

## Features

### Tasks

- Load tasks from the API.
- Create tasks.
- Edit title, description, due date, and category.
- Mark tasks as completed.
- Reopen completed tasks.
- Delete tasks with confirmation.
- Update the interface without reloading the page.

### Categories

- Load categories from the API.
- Create categories.
- Rename categories.
- Delete unused categories.
- Display backend conflict messages when a category contains tasks.
- Update associated task labels after a category is renamed.

### Interface states

- Initial loading state.
- API connection status.
- Empty task and category states.
- Form submission states.
- Validation and backend errors.
- Responsive layout for desktop and mobile screens.

## Project structure

```text
frontend-react/
├── public/
├── src/
│   ├── api/
│   │   ├── taskCategoriesApi.ts
│   │   └── taskItemsApi.ts
│   ├── components/
│   │   ├── CategoryManager.tsx
│   │   └── TaskForm.tsx
│   ├── types/
│   │   ├── taskCategory.ts
│   │   └── taskItem.ts
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Responsibilities

- `api/`: HTTP communication with the .NET API.
- `components/`: reusable user-interface components.
- `types/`: TypeScript representations of API contracts.
- `App.tsx`: application state and coordination.
- `App.css`: component and layout styles.
- `index.css`: global styles and normalization.
- `main.tsx`: React application entry point.

## Environment configuration

Copy the example environment file:

```bash
cp .env.example .env.development.local
```

Default configuration:

```env
VITE_API_BASE_URL=http://localhost:5281
```

Only variables beginning with `VITE_` are exposed to frontend code.

Do not place database passwords, API secrets, or private credentials in frontend environment variables. Browser users can inspect all values included in a frontend application.

## Install dependencies

From `frontend-react`:

```bash
npm install
```

The repository root includes an `.nvmrc` file. From the project root, the expected Node.js version can be installed with:

```bash
nvm install
nvm use
```

## Run in development

Ensure PostgreSQL and the .NET API are running first.

From `frontend-react`:

```bash
npm run dev
```

Or from the repository root:

```bash
npm --prefix frontend-react run dev
```

Default address:

```text
http://localhost:5173
```

## Validate the frontend

### Lint

```bash
npm run lint
```

### Production build

```bash
npm run build
```

From the repository root:

```bash
npm --prefix frontend-react run lint
npm --prefix frontend-react run build
```

Production files are generated inside:

```text
frontend-react/dist/
```

The `dist` directory is ignored by Git because it can be regenerated.

## React concepts demonstrated

- Functional components.
- Props.
- `useState`.
- `useEffect`.
- Controlled forms.
- Conditional rendering.
- List rendering with `map`.
- Immutable updates with `map` and `filter`.
- Asynchronous event handlers.
- Parallel API loading with `Promise.all`.
- Request cancellation with `AbortController`.
- Shared forms for create and edit operations.
- Type-only TypeScript imports.
- Environment variables with Vite.

## API integration

The frontend consumes the following resource groups:

```text
/api/categories
/api/tasks
```

Requests use the browser `fetch` API. Non-successful HTTP responses are converted into errors and displayed in the interface.

The frontend expects the API to run on:

```text
http://localhost:5281
```

and the API CORS policy must allow:

```text
http://localhost:5173
```

## Important behavior

A category containing tasks cannot be deleted.

The backend returns:

```text
409 Conflict
```

The frontend displays the returned problem detail without removing the category from local state.

## Planned improvements

- Task filtering.
- Search.
- Pagination.
- Automated component tests.
- End-to-end tests.
- Toast notifications.
- Improved accessibility.
- Production deployment.
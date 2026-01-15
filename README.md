# iTalkIT Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 19.0.0.

## Prerequisites

Before running this project, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v19)
```bash
npm install -g @angular/cli
```

## Installation
```bash
# Install dependencies
npm install
```

## Configuration

Update the API URL in `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.
```bash
ng serve
# or
ng serve --open  # opens browser automatically
```

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

Examples:
```bash
ng generate component components/my-component
ng generate service services/my-service
ng generate guard guards/my-guard
```

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
```bash
# Development build
ng build

# Production build
ng build --configuration production
```

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
```bash
ng test
```

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.
```bash
ng e2e
```

## Project Structure

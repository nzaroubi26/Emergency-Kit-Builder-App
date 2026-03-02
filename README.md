# Emergency Prep Kit Builder

A React + TypeScript single-page application for building emergency preparedness kits.

## Tech Stack

- **Build tool:** Vite 6.x
- **Framework:** React 18.x + TypeScript 5.x (strict)
- **Styling:** Tailwind CSS v4.x
- **State management:** Zustand 5.x
- **Routing:** React Router 6.4+ (Data Router API)
- **Icons:** lucide-react
- **Testing:** Vitest 2.x + React Testing Library 16.x

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5000`.

### Build for Production

```bash
npm run build
```

Static output is generated in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Testing

```bash
npm run test          # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:coverage # Run tests with coverage report
```

## Linting and Type Checking

```bash
npm run lint          # Run ESLint
npm run typecheck     # Run TypeScript type checker
```

## Deployment

This is a static SPA. Deploy the `dist/` directory to any static hosting provider (Replit, Vercel, Netlify, etc.).

1. Run `npm run build`
2. Deploy the contents of `dist/`

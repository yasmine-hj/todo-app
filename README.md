# To-Do List App ✅

A simple, elegant to-do list application built with Next.js and TypeScript.

## Features

- **Create tasks** with customizable priority levels (Low, Medium, High)
- **Edit tasks** inline with title and priority updates
- **Mark tasks complete** with a single click
- **Delete tasks** with confirmation dialog
- **Filter by priority** to focus on what matters
- **Dark/Light mode** toggle for comfortable viewing
- **Responsive design** works on desktop and mobile

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org) with App Router
- **Language**: TypeScript
- **Styling**: styled-components
- **Testing**: Jest + React Testing Library
- **Storage**: JSON file-based (for demo purposes)

## Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Run the development server**:

   ```bash
   npm run dev
   ```

3. **Open** [http://localhost:3000](http://localhost:3000) in your browser

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Build for production     |
| `npm run start` | Start production server  |
| `npm test`      | Run tests                |
| `npm run lint`  | Run ESLint               |

## Project Structure

```
src/
├── app/              # Next.js app router pages & API routes
├── components/       # React components
│   ├── common/       # Shared UI components
│   ├── layout/       # Layout components (ThemeToggle)
│   ├── tasks/        # Task-related components
│   └── TodoApp/      # Main app component
├── hooks/            # Custom React hooks
├── lib/              # Utilities and storage
└── types/            # TypeScript type definitions
```

## License

MIT

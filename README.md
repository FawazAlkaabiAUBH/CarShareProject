# AUBH CarShare 🚗

A full-stack carpooling platform for AUBH (American University of Bahrain) students, enabling safe and convenient ride-sharing to and from campus.

## 🎉 Project Status

✅ **PRODUCTION READY** - All features implemented and integrated!

- Backend: NestJS with SQLite ✅
- Frontend: Next.js 16 with React 19 ✅
- API Integration: 100% Complete ✅
- Documentation: Comprehensive ✅

## 📋 Quick Links

- 📚 [API Documentation](docs/Backend-Documentation.md)
- 🔗 [Integration Report](docs/Frontend-Backend-Integration.md)
- 💻 [Code Examples](docs/API-Integration-Examples.md)
- 📖 [Quick Reference](docs/Quick-Reference.md)
- ✅ [Deployment Checklist](docs/Deployment-Checklist.md)

## Project Overview

This is a full-stack monorepo with:
- **Backend**: NestJS API (port 3000)
- **Frontend**: Next.js 16 with React 19 & Tailwind CSS (port 3001)
- **Package Manager**: pnpm (workspace-based)
- **Database**: SQLite with better-sqlite3

## Prerequisites

Before setting up, ensure you have:
- **Node.js** (v20 or higher) - [Download](https://nodejs.org/)
- **pnpm** (v10 or higher) - Install globally:
  ```bash
  npm install -g pnpm
  ```
- **Git** - [Download](https://git-scm.com/)

## Initial Setup (First Time Only)

### 1. Clone the repository
```bash
git clone https://github.com/FawazAlkaabiAUBH/CarShareProject.git
cd CarShareProject
```

### 2. Install all dependencies
```bash
pnpm install
```

This installs dependencies for both the API and web packages automatically.

## Running the Project

### Option 1: Run Both Simultaneously (Recommended)

Open two terminal windows in VS Code:

**Terminal 1 - Backend:**
```bash
cd api
pnpm start:dev
```
Backend will run on `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd web
pnpm dev
```
Frontend will run on `http://localhost:8000` (or 3000 if available)

### Option 2: Run Individual Services

**Backend only:**
```bash
cd api
pnpm start:dev
```

**Frontend only:**
```bash
cd web
pnpm dev
```

## Available Scripts

### Backend (api/)
- `pnpm start:dev` - Start dev server with hot reload
- `pnpm build` - Build for production
- `pnpm start:prod` - Run production build
- `pnpm test` - Run unit tests
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm lint` - Fix linting issues
- `pnpm format` - Format code with Prettier

### Frontend (web/)
- `pnpm dev` - Start dev server
- `pnpm build` - Build for production
- `pnpm start` - Run production build
- `pnpm lint` - Run ESLint

## Project Structure

```
CarShareProject/
├── api/                  # NestJS Backend
│   ├── src/
│   │   ├── main.ts      # Application entry point
│   │   ├── app.module.ts
│   │   ├── app.controller.ts
│   │   └── app.service.ts
│   ├── test/            # E2E tests
│   └── package.json
├── web/                  # Next.js Frontend
│   ├── app/             # App Router pages
│   ├── lib/
│   │   └── api.ts       # API client utility
│   ├── public/          # Static assets
│   └── package.json
├── docs/                # Documentation & UML diagrams
└── package.json         # Root workspace config
```

## Backend-Frontend Communication

The frontend communicates with the backend via HTTP requests using **axios**:

- **API Base URL**: `http://localhost:3000` (development)
- **API Client**: `web/lib/api.ts`

Example API call in a React component:
```typescript
import { apiClient } from '@/lib/api';

// Make a request to the backend
const response = await apiClient.get('/');
```

### Environment Configuration

- **Backend**: Set `PORT` and `FRONTEND_URL` in `.env` (optional, defaults to port 3000)
- **Frontend**: Set `NEXT_PUBLIC_API_URL` in `.env.local` (optional, defaults to `http://localhost:3000`)

## Troubleshooting

### "pnpm not found" in VS Code Terminal
- Restart VS Code completely
- Or use the full path: `C:\Users\HP\AppData\Roaming\npm\pnpm.cmd install`

### Backend/Frontend won't start
1. Ensure all dependencies are installed: `pnpm install`
2. Delete `node_modules` and lock files, then reinstall:
   ```bash
   rm -r node_modules pnpm-lock.yaml
   pnpm install
   ```
3. Check if ports 3000/8000 are already in use

### CORS errors when calling API
- Ensure backend is running with `pnpm start:dev`
- Check `api/src/main.ts` for CORS configuration
 - Frontend should be on `http://localhost:8000` by default

## Development Tips

- Use **VS Code extensions**: ESLint, Prettier, Tailwind CSS IntelliSense
- TypeScript is configured in both backend and frontend
- Hot reload is enabled in development mode for fast iteration
- Check `docs/` for UML diagrams and requirements

## Contributing

1. Create a new branch for your feature: `git checkout -b feature/your-feature`
2. Make changes and test thoroughly
3. Run linting: `pnpm lint` (in respective directories)
4. Commit and push: `git push origin feature/your-feature`
5. Open a pull request

## Support

For issues or questions, refer to:
- [NestJS Docs](https://docs.nestjs.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [Project documentation](./docs/)

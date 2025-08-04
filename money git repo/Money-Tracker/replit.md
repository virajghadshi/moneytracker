# Cash Book Application

## Overview

This is a mobile-first cash book application that exactly matches the user's reference design. The application allows users to track cash inflows and outflows, view transaction history with running balance calculations, and manage their cash transactions. It features a React frontend with TypeScript and uses only local storage for data persistence - no authentication or server-side storage required.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state, localStorage for client-side persistence
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Database**: PostgreSQL (via Neon serverless)
- **Development**: Hot reloading with tsx
- **Build**: esbuild for production bundling

### Data Storage
- **Primary Database**: PostgreSQL with Drizzle ORM
- **Local Storage**: Browser localStorage for offline transaction persistence
- **Session Storage**: PostgreSQL sessions with connect-pg-simple

## Key Components

### Frontend Components
- **Cash Book Page**: Main application interface showing balance and transaction list
- **Transaction Modal**: Form for adding new cash in/out transactions
- **UI Components**: Complete shadcn/ui component library including buttons, dialogs, forms, etc.
- **Custom Hooks**: `use-transactions` for transaction management, `use-mobile` for responsive behavior

### Backend Components
- **Storage Interface**: Abstraction layer for data operations with memory-based implementation
- **Routes**: Express route handlers (currently minimal setup)
- **Vite Integration**: Development server with HMR support

### Shared Schema
- **Transaction Schema**: Zod-based validation for transaction data
- **Types**: Shared TypeScript types between frontend and backend

## Data Flow

1. **Transaction Creation**: User submits transaction through modal form
2. **Local Storage**: Transactions are immediately stored in browser localStorage
3. **Balance Calculation**: Running balance is calculated client-side
4. **Filtering**: Time-based filtering (daily, weekly, monthly, yearly)
5. **Persistence**: Data persists across browser sessions via localStorage

## External Dependencies

### Frontend Dependencies
- React ecosystem: react, react-dom, @types/react
- UI Library: @radix-ui components, lucide-react icons
- Styling: tailwindcss, class-variance-authority, clsx
- State Management: @tanstack/react-query
- Forms: react-hook-form, @hookform/resolvers
- Utilities: date-fns, zod for validation

### Backend Dependencies
- Server: express, tsx for development
- Database: drizzle-orm, @neondatabase/serverless
- Session: express-session, connect-pg-simple
- Build: esbuild, vite

### Development Dependencies
- TypeScript configuration and tooling
- Vite plugins including Replit integration
- PostCSS and Autoprefixer for CSS processing

## Deployment Strategy

### Development
- Frontend: Vite dev server with HMR
- Backend: tsx with file watching
- Database: Neon serverless PostgreSQL
- Command: `npm run dev`

### Production
- Frontend: Vite build to `dist/public`
- Backend: esbuild bundle to `dist/index.js`
- Static Serving: Express serves built frontend
- Database: Production PostgreSQL via DATABASE_URL
- Commands: `npm run build` then `npm start`

### Database Management
- Schema: Defined in `shared/schema.ts`
- Migrations: Generated in `./migrations` directory
- Push: `npm run db:push` for schema synchronization

## Recent Changes
- July 08, 2025: Rebuilt application to match user's exact cash book design reference
- Implemented blue header with navigation icons
- Added time filter buttons (All, Daily, Weekly, Monthly, Yearly)
- Created transaction list with running balance calculations
- Added Cash In/Cash Out action buttons
- Fixed JavaScript reference errors in transaction hooks
- Added PostgreSQL database integration with full CRUD operations
- Fixed API date validation issues - Cash In/Out functions now working perfectly
- Added comprehensive edit and delete functionality with icons on each transaction
- Implemented modal support for both add and edit modes
- User confirmed app is working correctly with database persistence and full transaction management

## User Preferences

Preferred communication style: Simple, everyday language.
Design Requirements: Exact match to provided reference image with blue color scheme.
Data Storage: Local storage only, no authentication or server-side persistence required.
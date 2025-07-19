# Emergency Management System

## Overview

This is a full-stack emergency management system built with React (frontend) and Express.js (backend). The application allows users to report emergencies and provides a dashboard for managing emergency reports with real-time status updates.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server components:

- **Frontend**: React SPA with TypeScript, built with Vite
- **Backend**: Express.js REST API with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing

## Key Components

### Frontend Architecture (`client/`)
- **React Application**: Modern React with TypeScript and functional components
- **UI Components**: Complete shadcn/ui component library for consistent design
- **Routing**: Simple client-side routing with Wouter
- **State Management**: TanStack Query for server state management
- **Styling**: Tailwind CSS with custom design tokens
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture (`server/`)
- **Express Server**: RESTful API with TypeScript
- **Database Layer**: Drizzle ORM with PostgreSQL (Neon serverless)
- **API Routes**: Organized route handlers for emergency reports
- **Storage Layer**: Abstracted storage interface for database operations
- **Error Handling**: Centralized error handling middleware

### Shared Code (`shared/`)
- **Schema Definitions**: Zod schemas for data validation
- **Type Definitions**: Shared TypeScript types between client and server
- **Database Schema**: Drizzle schema definitions

## Data Flow

### Emergency Report Workflow
1. **Report Creation**: Users submit emergency reports through a form
2. **Validation**: Client-side validation with Zod schemas
3. **API Processing**: Server validates and stores reports in PostgreSQL
4. **Status Management**: Reports progress through states (new → acknowledged → dispatched → resolved)
5. **Dashboard Updates**: Real-time dashboard shows reports and statistics

### Key Data Entities
- **Emergency Reports**: Core entity with location, urgency, request types, and status
- **Users**: Basic user management (currently minimal implementation)

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL database
- **Drizzle ORM**: Type-safe database operations
- **Connection**: WebSocket-based connection for serverless compatibility

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Icon library
- **Date-fns**: Date manipulation utilities

### Development Tools
- **Vite**: Frontend build tool with hot reload
- **TypeScript**: Type safety across the entire stack
- **ESBuild**: Fast bundling for production builds

## Deployment Strategy

### Development
- **Frontend**: Vite dev server with hot module replacement
- **Backend**: Direct TypeScript execution with tsx
- **Database**: Environment-based connection string
- **Error Overlay**: Replit-specific error handling in development

### Production
- **Build Process**: 
  - Frontend: Vite builds static assets to `dist/public`
  - Backend: ESBuild bundles server code to `dist/index.js`
- **Static Serving**: Express serves built frontend assets
- **Environment**: Production mode with optimized builds

### Configuration
- **Environment Variables**: Database URL and other secrets
- **Path Aliases**: Consistent import paths across client and server
- **Build Scripts**: Separate development and production commands

The application is designed for easy deployment on platforms like Replit, with proper environment variable handling and production-ready build processes.
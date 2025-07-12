# Supply Chain Management App - "Tracko"

## Overview

This is a full-stack supply chain management application built to automate data extraction from WhatsApp messages, emails, and PDF documents. The app eliminates the need for manual data entry by automatically parsing and extracting delivery information, supplier details, and invoicing data into structured formats.

**Current Status**: Fully functional with enhanced UI, interactive charts, and demo features. Successfully processing sample data and running without errors.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (January 2025)

### Latest Updates
- ✅ Fixed React router warnings by replacing nested `<a>` tags with `<div>` elements
- ✅ Resolved TypeScript errors in backend storage and route handlers
- ✅ Added interactive charts using Recharts library (pie charts and line charts)
- ✅ Created comprehensive demo parser page for testing WhatsApp message processing
- ✅ Enhanced dashboard with real-time performance metrics and trend analysis
- ✅ Improved WhatsApp parser page with realistic webhook URL display
- ✅ Added custom logo and rebranded app to "Tracko"
- ✅ Implemented Excel export functionality for dashboard metadata
- ✅ Added comprehensive Excel export with multiple worksheets (metadata, performance, trends, suppliers, deliveries)

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Styling**: Tailwind CSS with CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **File Upload**: Multer for handling document uploads
- **API Design**: RESTful endpoints with proper error handling
- **Development**: Hot reload with Vite integration in development mode

## Key Components

### Database Schema
- **Suppliers**: Store supplier information with performance metrics (on-time delivery, communication quality, etc.)
- **Deliveries**: Track delivery status, quantities, dates, and associated metadata
- **Documents**: Manage uploaded files with processing status and extracted data
- **WhatsApp Messages**: Store parsed message content with extraction results
- **Processing Stats**: Dashboard analytics and processing metrics

### Data Processing Pipeline
- **Document Upload**: Support for PDF, image, and text file uploads
- **WhatsApp Parser**: Extract delivery information from message content
- **OCR Integration**: Text extraction from images and scanned documents
- **Data Validation**: Zod schemas for type-safe data validation
- **Status Tracking**: Processing states (processing, completed, review, error)

### User Interface
- **Dashboard**: Overview of processing stats and recent deliveries
- **Supplier Management**: View and manage supplier performance metrics
- **Document Upload**: Drag-and-drop interface for file uploads
- **WhatsApp Parser**: Interface for processing WhatsApp messages
- **Manual Entry**: Form-based data entry for manual processing

## Data Flow

1. **Data Ingestion**: Multiple sources (WhatsApp, email, PDF uploads)
2. **Processing**: OCR, text extraction, and data parsing
3. **Validation**: Schema validation and duplicate detection
4. **Storage**: Structured data storage in PostgreSQL
5. **Presentation**: Dashboard and reporting interfaces

## External Dependencies

### Database
- **PostgreSQL**: Primary database with Neon serverless hosting
- **Drizzle ORM**: Type-safe database operations and migrations
- **Connection**: Environment-based database URL configuration

### File Processing
- **Multer**: File upload middleware with size limits (10MB)
- **Storage**: Local file system with configurable upload directory

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

## Deployment Strategy

### Development
- **Local Development**: Vite dev server with hot reload
- **Database**: Drizzle migrations with push command
- **Environment**: NODE_ENV=development with debug logging

### Production
- **Build Process**: Vite build for frontend, esbuild for backend
- **Server**: Express.js serving static files and API endpoints
- **Database**: PostgreSQL with connection pooling
- **Environment**: NODE_ENV=production with optimized builds

### Configuration
- **TypeScript**: Strict mode with path aliases for clean imports
- **ESM**: Full ES module support throughout the application
- **Tooling**: PostCSS with Tailwind and Autoprefixer

The application follows a modern full-stack architecture with clear separation of concerns, type safety throughout, and a focus on automated data processing workflows.
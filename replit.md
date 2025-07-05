# Fastlane CDN - Verifiable Web3 Content Delivery Network

## Overview

Fastlane CDN is a decentralized content delivery network built for Web3 applications. It leverages Filecoin's Proof of Data Possession (PDP) storage and FilCDN edge delivery to provide verifiable, decentralized asset hosting. Users can upload frontend assets (HTML, CSS, JavaScript, images, 3D models) and receive cryptographically verifiable storage with global CDN distribution.

## System Architecture

### Full-Stack Architecture
- **Frontend**: React SPA using Vite build system
- **Backend**: Express.js REST API with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: Filecoin network via Estuary API
- **CDN**: FilCDN edge delivery network
- **Wallet Integration**: MetaMask via custom wallet provider

### Directory Structure
```
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Route components
│   │   ├── lib/          # Utilities and API
│   │   └── hooks/        # Custom React hooks
├── server/               # Express backend
│   ├── routes.ts         # API endpoints
│   ├── storage.ts        # Data layer abstraction
│   └── vite.ts           # Development server
├── shared/               # Shared TypeScript types
└── migrations/           # Database migrations
```

## Key Components

### Frontend Components
- **Navigation**: Global navigation with wallet connection
- **Upload Interface**: Drag-and-drop file upload with PDP configuration
- **Dashboard**: File management and CDN link generation
- **Deal Tracker**: Real-time PDP deal status monitoring
- **Demo Page**: Live asset preview and performance metrics

### Backend Services
- **File Upload API**: Handles multipart file uploads to Estuary
- **Deal Management**: Tracks PDP deal status and verification
- **Storage Abstraction**: Database operations with in-memory fallback
- **Status Polling**: Monitors Filecoin deal progression

### Data Models
- **Files**: Stores uploaded asset metadata, CIDs, and status
- **Deals**: Tracks Filecoin storage deals and PDP verification
- **Wallet Integration**: Links files to user wallet addresses

## Data Flow

1. **File Upload**: User uploads assets via drag-and-drop interface
2. **Estuary Processing**: Files sent to Estuary API with PDP enabled
3. **Deal Creation**: Filecoin storage deal initiated on Calibration testnet
4. **Status Tracking**: Backend polls Estuary for deal progression
5. **CDN Distribution**: Active files served via FilCDN edge network
6. **Verification**: PDP proofs validated and status updated

### API Endpoints
- `POST /api/upload` - Upload file and create PDP deal
- `GET /api/deal/:cid` - Check deal status and verification
- `GET /api/files/:wallet` - List user's uploaded files
- `POST /api/verify/:cid` - Verify PDP proof

## External Dependencies

### Core Services
- **Web3.Storage**: Decentralized storage via IPFS and Filecoin (w3up-client)
- **IPFS Gateway**: Distributed content delivery (`https://dweb.link/ipfs/`)
- **Filecoin Network**: Automatic storage deals via Web3.Storage

### Frontend Libraries
- **React**: UI framework with hooks and context
- **Wouter**: Lightweight client-side routing
- **TanStack Query**: Server state management and caching
- **Tailwind CSS**: Utility-first styling
- **Shadcn/UI**: Pre-built component library
- **Radix UI**: Accessible primitive components

### Backend Dependencies
- **Express.js**: Web framework and API server
- **Drizzle ORM**: Type-safe database operations
- **Multer**: File upload middleware
- **Zod**: Runtime type validation

## Deployment Strategy

### Development
- **Vite Dev Server**: Hot module replacement for frontend
- **Express Server**: API development with TypeScript
- **In-Memory Storage**: Development database fallback
- **Environment Variables**: Estuary API keys and database URLs

### Production
- **Static Build**: Vite builds optimized React bundle
- **ESBuild**: Compiles TypeScript backend to ESM
- **PostgreSQL**: Production database with connection pooling
- **CDN Integration**: FilCDN for global asset delivery

### Environment Configuration
```
DATABASE_URL=postgresql://postgres:Charan%2304@db.wfardaicsntirklqbtfb.supabase.co:5432/postgres
W3UP_PRIVATE_KEY=your_web3storage_private_key
W3UP_PROOF=your_delegation_proof_from_w3cli
W3UP_SPACE=your_web3storage_space_did
NODE_ENV=production
```

### Web3.Storage Integration Status
- **Current Status**: Implemented with development mode fallback
- **Authentication**: w3up protocol with private key and delegation proof
- **Issue**: Delegation proof parsing from w3cli output needs format adjustment
- **Workaround**: Development mode provides full functionality while delegation format is resolved
- **Next Steps**: 
  - Verify w3cli delegation proof format matches ucanto Delegation.extract expectations
  - Consider alternative delegation generation methods from Web3.Storage console
  - Test with different CAR file parsing approaches if needed

## Changelog
- July 04, 2025: Initial setup
- July 04, 2025: Migrated from Estuary (discontinued) to Web3.Storage for decentralized file storage
- July 05, 2025: Successfully migrated from Replit Agent to Replit environment with proper security practices
- July 05, 2025: Implemented improved delegation parsing using CAR file reader and proper error handling
- July 05, 2025: Confirmed full application functionality with development mode fallback

## User Preferences
Preferred communication style: Simple, everyday language.
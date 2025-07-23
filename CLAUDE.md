# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Development
npm run dev              # Start development server at http://localhost:3000

# Build and deployment
npm run build           # Build the Next.js application for production (static export)
npm run start           # Start production server using serve (serves from ./out directory)
npm run predeploy       # Alias for npm run build (used before deployment)
npm run deploy          # Deploy to GitHub Pages using gh-pages

# Code quality
npm run lint            # Run Next.js ESLint checks
```

## Project Architecture and Structure

### Overview
This is a **Next.js 14 application** that serves as a restaurant/attraction viewer for multiple countries. The app displays restaurant data from CSV files with search, filtering, pagination, and admin functionality.

### Key Architecture Patterns

**Static Site Generation**: The app uses Next.js static export (`output: 'export'`) to generate a static site deployed on GitHub Pages.

**Data Layer**: 
- Restaurant data is stored in CSV files in `public/data/` directory
- CSV parsing handled by PapaParse library in `csvService.ts`
- Firebase Firestore used for admin operations (job queue and tag updates)

**Component Structure**:
- Main application logic in `src/app/page.tsx` (600+ lines, handles state management, pagination, search, filtering)
- Reusable UI components in `src/app/components/`
- Admin interface in `src/app/admin/page.tsx`

### Core Data Model

**RestaurantData type** (`src/app/types/RestaurantData.ts`):
- Contains comprehensive restaurant information including ratings, reviews, images, opening hours
- Key fields: `Id`, `Name`, `Address`, `Rating`, `Tags`, `Images`, `AiReviewSummary`, `ChainRestaurantId`
- Array fields are stored as JSON strings in CSV and parsed during load

### State Management Approach
- Uses React hooks for local state management (no Redux/Zustand)
- Main state in `page.tsx`: `data`, `ogData`, `currentPageData`, `selectedFilters`, `searchTerm`
- Pagination state: `currentPage`, `itemsPerPage` (20), `totalPages`

### CSV Data Processing
- **File mapping**: `csvService.ts` maps country codes to CSV filenames
- **Supported countries**: Japan, Taiwan, Hong Kong, Malaysia, Singapore
- **Data transformation**: JSON arrays in CSV cells are parsed during load
- **Image deduplication**: Removes duplicate images based on URL patterns

### Firebase Integration
- **Configuration**: `firebase.config.js` uses environment variables for Firebase setup
- **Admin operations**: Tag updates and job submissions go to Firestore collections
- **Collections used**: `jobs`, `updateTagsJobs`

### Pagination System
- **Items per page**: 20 restaurants
- **Navigation**: Previous/Next buttons plus direct page number buttons
- **Scroll behavior**: Auto-scroll to top on page changes
- **State sync**: `currentPageData` slice updated on page changes

### Search and Filtering
- **Text search**: Searches across `Name`, `Address`, and `Tags` fields
- **Tag filtering**: Multi-select dropdown with both custom tags and rating ranges
- **Rating filters**: Static options like "0-1 star", "1-2 stars", etc.
- **Filter logic**: Combines text search with AND logic for selected tags

### Admin Features
- **Authentication**: Simple session storage check (`user === 'admin'`)
- **Tag editing**: Inline tag editor for restaurants (edit mode toggle)
- **Job submission**: Admin can submit search requests and links via Firebase
- **Access control**: Admin routes protected by session check

## Development Notes

### Environment Variables Required
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_GROQ_API_KEY
```

### Static File Serving
- CSV data files in `public/data/` directory
- Static assets served from `public/` directory
- Production base path: `/Attractions_Viewer` (GitHub Pages)

### CSS and Styling
- Global styles in `src/app/globals.css`
- Component-specific CSS in component directories (e.g., `ProgressBar.css`)
- React Select custom styling defined in `constants.ts`

### Key Dependencies
- **Next.js 14**: App router, static export
- **PapaParse**: CSV parsing and processing
- **Firebase**: Firestore for admin operations
- **React Select**: Multi-select dropdowns with custom styling
- **Groq SDK**: AI integration (currently unused in main flow)
- **Axios**: HTTP requests

### Deployment Configuration
- **Target**: GitHub Pages static hosting
- **Build output**: `./out` directory
- **Base path**: Configured for `/Attractions_Viewer` in production
- **Asset prefix**: Relative paths (`./`) for static assets

### Testing and Quality Assurance
- TypeScript strict mode enabled
- ESLint configuration via Next.js
- No test framework currently configured

## Working with This Codebase

When adding new countries:
1. Add CSV file to `public/data/`
2. Update `getFilePathByCountry()` in `csvService.ts`
3. Add country option to `COUNTRY_OPTIONS` in `constants.ts`
4. Update `checkIfCountrySupported()` in `utilService.ts`

When modifying restaurant data:
- Ensure CSV headers match `RestaurantData` type
- JSON arrays in CSV cells will be auto-parsed
- Test with small datasets first due to large file sizes

When working with admin features:
- Ensure Firebase environment variables are set
- Test admin authentication flow
- Monitor Firestore collections for job submissions
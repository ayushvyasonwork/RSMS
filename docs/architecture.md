# RSMS (Retail Sales Management System) - Architecture Documentation

## System Overview

RSMS is a full-stack web application for managing and analyzing retail sales data. It provides comprehensive filtering, searching, sorting, and pagination capabilities for sales records with a modern, responsive user interface.

**Tech Stack:**
- **Backend:** Node.js + Express.js + MongoDB (Mongoose ODM)
- **Frontend:** Next.js (React) + Redux Toolkit + Tailwind CSS
- **Communication:** RESTful API with Axios

---

## Backend Architecture

### Architecture Pattern
The backend follows a **layered MVC architecture** with clear separation of concerns:

```
Client Request → Routes → Controllers → Services → Models → Database
```

### Technology Stack
- **Runtime:** Node.js (ES6 Modules)
- **Framework:** Express.js 
- **Database:** MongoDB 
- **Middleware:** CORS, express.json()
- **Environment:** dotenv for configuration

### Core Components

#### 1. **Server Entry Point** (`src/index.js`)
- Initializes Express application
- Configures middleware (CORS, JSON parsing)
- Establishes database connection
- Mounts API routes
- Handles graceful startup/shutdown
- Health check endpoint: `GET /api/health`

#### 2. **Routes Layer** (`src/routes/`)
**Purpose:** Define API endpoints and map them to controllers

- `salesRoutes.js`:
  - `GET /api/sales` - Fetch paginated sales with filters
  - `GET /api/sales/:id` - Fetch single sale by ID
  - `GET /api/filters` - Get available filter options

#### 3. **Controllers Layer** (`src/controllers/`)
**Purpose:** Handle HTTP requests/responses and error handling

- `salesController.js`:
  - `getSales()` - Processes query parameters, calls service, returns JSON
  - `getSaleById()` - Validates ID, fetches record, handles 404
  - `getFilters()` - Returns available filter values
  - Error handling with appropriate HTTP status codes

#### 4. **Services Layer** (`src/services/`)
**Purpose:** Business logic and data processing

- `salesService.js`:
  - `fetchSales(query)` - Complex filtering, sorting, pagination logic
    - Parses CSV parameters (multi-value filters)
    - Builds MongoDB query with $or, $in, $gte/$lte operators
    - Text search on customer name and phone number
    - Age range filtering with validation
    - Date range filtering (start/end dates)
    - Dynamic sorting (date, quantity, customerName)
    - Pagination calculation
    - Returns data + metadata (totalPages, totalItems, etc.)
  - `fetchSaleById(id)` - Fetch single record by MongoDB ObjectId
  - `fetchFilters()` - Aggregates distinct values for filter dropdowns

#### 5. **Models Layer** (`src/models/`)
**Purpose:** Database schema definition

- `Sale.js`:
  - Defines Mongoose schema with 25+ fields
  - Indexed fields: `transactionId`, `customerName`, `phoneNumber`
  - Text index for search functionality
  - Field types: Number, String, Date, Array (tags)
  - Collection name: `sales`

#### 6. **Utilities** (`src/utils/`)
- `db.js`:
  - MongoDB connection management
  - Error handling and reconnection logic
  - Graceful shutdown on SIGINT
  - Connection state monitoring

- `importCsv.js`:
  - CSV data import utility
  - Parses truestate_assignment_dataset.csv
  - Transforms data (date parsing, tag splitting)
  - Bulk insert into MongoDB

### API Design Principles
- RESTful conventions
- Query parameter-based filtering
- JSON request/response format
- Error responses with meaningful messages
- Pagination with page/limit parameters
- Comma-separated values for multi-select filters

---

## Frontend Architecture

### Architecture Pattern
The frontend follows **Redux + Component-Based Architecture** with:
- Centralized state management (Redux Toolkit)
- Reusable UI components
- Custom hooks for performance optimization
- Service layer for API communication

### Technology Stack
- **Framework:** Next.js 14.1.0 (React 18.2.0)
- **State Management:** Redux Toolkit v2.11.0 + React-Redux v9.2.0
- **Styling:** Tailwind CSS v3.4.0
- **HTTP Client:** Axios v1.13.2
- **Icons:** Lucide React v0.278.0
- **Build Tool:** Next.js with automatic code splitting

### Core Architecture Layers

#### 1. **Pages Layer** (`src/pages/`)
**Purpose:** Next.js page components (routing)

- `index.jsx` - Main dashboard page
  - Fetches sales data and filters
  - Manages loading states
  - Computes summary metrics (totals for current page)
  - Integrates all components (Sidebar, TopBar, Table, etc.)
  - Debounced search implementation
  - React hooks: useEffect, useCallback, useState

- `_app.jsx` - Application wrapper
  - Redux Provider setup
  - Global layout structure
  - State persistence across pages

- `_document.jsx` - Custom HTML document
  - Meta tags configuration
  - Font loading

#### 2. **State Management** (`src/store/`)
**Purpose:** Centralized application state with Redux

- `index.js` - Redux store configuration
  - Combines reducers
  - Configures middleware
  - Disables serializable check for date objects

- `slices/filtersSlice.js` - Main state slice
  - **State Shape:**
    ```javascript
    {
      search: string,
      filters: {
        regions: array,
        genders: array,
        categories: array,
        tags: array,
        payment: array,
        ageMin: string,
        ageMax: string,
        startDate: string,
        endDate: string
      },
      sorting: { sortBy, sortOrder },
      pagination: { page, limit }
    }
    ```
  - **Actions:**
    - `setSearch` - Updates search term, resets page
    - `toggleFilter` - Toggle array filter values
    - `setFilterValue` - Set single filter value
    - `setMultipleFilters` - Bulk filter update
    - `setSorting` - Update sort field/direction
    - `setPage` - Navigate pagination
    - `resetAllFilters` - Clear all filters
  - **Selectors:**
    - `selectSearch`, `selectFilters`, `selectSorting`, `selectPagination`

#### 3. **Components Layer** (`src/components/`)
**Purpose:** Reusable UI components

- `TopBar.jsx`:
  - Logo and app title
  - Mobile menu toggle
  - User profile section

- `Sidebar.jsx`:
  - Filter panel (regions, genders, categories, tags, payment)
  - Age range sliders
  - Date range pickers
  - Clear all filters button
  - Responsive drawer for mobile

- `SalesTable.jsx`:
  - Data table with 18 columns
  - Horizontal scroll for overflow
  - Phone number copy functionality
  - Row click handling
  - Amount formatting (₹ symbol)
  - Date formatting
  - Sticky table headers

- `SummaryCards.jsx`:
  - Displays aggregated metrics
  - Total units, total amount, total discount
  - Responsive grid layout

- `Pagination.jsx`:
  - Page navigation controls
  - Current page indicator
  - Previous/Next buttons
  - Disabled state handling

- `Filters.jsx`:
  - Individual filter components
  - Checkbox groups
  - Multi-select functionality

- `FiltersDropdown.jsx`:
  - Dropdown filter UI
  - Selection state management

- `Icons.jsx`:
  - Icon component wrappers
  - Lucide React integration

#### 4. **Services Layer** (`src/services/`)
**Purpose:** API communication abstraction

- `api.js`:
  - Axios instance configuration
  - Base URL from environment variable
  - Timeout: 15 seconds
  - Exported functions:
    - `getSales(params)` - GET /api/sales
    - `getSaleById(id)` - GET /api/sales/:id
    - `getFilters()` - GET /api/filters

#### 5. **Custom Hooks** (`src/hooks/`)
- `useDebounce.js`:
  - Debounces search input
  - Delays API calls (350ms default)
  - Prevents excessive requests
  - Cleanup on unmount

#### 6. **Utilities** (`src/utils/`)
- `query.js`:
  - `buildQuery(params)` - Cleans query parameters
  - Removes undefined/null/empty values
  - Prevents sending invalid query strings

#### 7. **Styles** (`src/styles/`)
- `globals.css`:
  - Tailwind directives
  - Custom global styles
  - CSS variables

### Component Communication Flow
1. User interacts with UI (Sidebar, TopBar, Pagination)
2. Component dispatches Redux action
3. Redux updates centralized state
4. State selectors trigger re-renders
5. Main page (index.jsx) detects state change
6. Debounced effect triggers API call
7. API service sends request to backend
8. Response updates local component state
9. UI re-renders with new data

### Performance Optimizations
- **Debouncing:** Search input debounced to reduce API calls
- **useCallback:** Memoized fetch function prevents unnecessary re-renders
- **Code Splitting:** Next.js automatic component splitting
- **Lazy Loading:** Components loaded on demand
- **Redux Selectors:** Efficient state selection prevents re-renders

---

## Data Flow

### Complete Request-Response Cycle

#### 1. **User Interaction Flow**
```
User Input (Search/Filter/Sort) 
  → Redux Action Dispatch 
  → State Update 
  → Selector Re-evaluation 
  → Component Re-render 
  → useEffect Trigger 
  → API Call
```

#### 2. **Search & Filter Flow**
```
[Frontend]
User types in search box
  → setSearch action dispatched
  → Redux state updates (search: "John", page: 1)
  → useDebounce hook delays for 350ms
  → useEffect detects debounced value change
  → buildQuery() constructs params: { search: "John", page: 1, limit: 10 }
  → api.getSales(params) called

[Backend]
Express receives GET /api/sales?search=John&page=1&limit=10
  → salesRoutes maps to getSales controller
  → Controller passes req.query to salesService.fetchSales()
  → Service builds MongoDB query: 
      { $or: [
        { customerName: /John/i },
        { phoneNumber: /John/i }
      ]}
  → Mongoose executes query with pagination
  → Returns { data: [...], totalPages: 5, totalItems: 47 }
  
[Frontend]
Response received
  → setData(body.data)
  → setTotalPages(body.totalPages)
  → Compute summary metrics
  → SalesTable component re-renders with new data
```

#### 3. **Multi-Filter Flow**
```
[Frontend]
User selects: Region="North,South", Gender="Male", AgeMin=25, AgeMax=45
  → Multiple Redux actions dispatched
  → State: filters: { regions: ["North","South"], genders: ["Male"], ageMin: "25", ageMax: "45" }
  → buildQuery() creates: { region: "North,South", gender: "Male", ageMin: "25", ageMax: "45" }

[Backend]
Service receives query params
  → parseCSVParam("North,South") → ["North", "South"]
  → Builds query: {
      customerRegion: { $in: ["North", "South"] },
      gender: { $in: ["Male"] },
      age: { $gte: 25, $lte: 45 }
    }
  → MongoDB finds matching documents
  → Returns filtered results
```

#### 4. **Sorting Flow**
```
User clicks column header (e.g., "Date ↓")
  → setSorting({ sortBy: "date", sortOrder: "desc" })
  → buildQuery() includes: { sortBy: "date", sortOrder: "desc" }
  → Backend creates sort object: { date: -1 }
  → MongoDB query: Sale.find(query).sort({ date: -1 })
  → Results returned in descending date order
```

#### 5. **Pagination Flow**
```
User clicks "Next Page"
  → setPage(2) action dispatched
  → State: pagination.page = 2
  → API called with: { page: 2, limit: 10 }
  → Backend: skip = (2-1) * 10 = 10
  → MongoDB: Sale.find(query).skip(10).limit(10)
  → Returns records 11-20
```

#### 6. **Initial Load Flow**
```
1. App loads → Redux initializes with default state
2. Two parallel API calls:
   - getFilters() → Fetches available filter options
   - getSales(defaultParams) → Fetches first page
3. State populated with filter options (for dropdowns)
4. Table populated with initial sales data
5. Summary cards show computed totals
```

### State Synchronization
- **Single Source of Truth:** Redux store holds all filter/sort/pagination state
- **Automatic Page Reset:** Changing filters/search resets to page 1
- **URL Persistence:** Can be extended to sync state with URL query params
- **Optimistic Updates:** UI updates immediately, data fetches in background

---

## Folder Structure

### Backend Structure
```
backend/
├── src/
│   ├── index.js                    # Application entry point
│   ├── truestate_assignment_dataset.csv  # Source data file
│   ├── controllers/
│   │   └── salesController.js      # Request handlers
│   ├── models/
│   │   └── Sale.js                 # Mongoose schema
│   ├── routes/
│   │   └── salesRoutes.js          # API endpoint definitions
│   ├── services/
│   │   └── salesService.js         # Business logic
│   └── utils/
│       ├── db.js                   # Database connection
│       └── importCsv.js            # Data import utility
├── .env                            # Environment variables
├── .env.example                    # Environment template
├── .gitignore                      # Git ignore rules
├── package.json                    # Dependencies & scripts
└── README.md                       # Backend documentation
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/                 # Reusable UI components
│   │   ├── Filters.jsx             # Filter controls
│   │   ├── FiltersDropdown.jsx     # Dropdown filter UI
│   │   ├── Icons.jsx               # Icon components
│   │   ├── Pagination.jsx          # Pagination controls
│   │   ├── SalesTable.jsx          # Main data table
│   │   ├── Sidebar.jsx             # Filter sidebar
│   │   ├── SummaryCards.jsx        # Metric cards
│   │   └── TopBar.jsx              # Top navigation bar
│   ├── hooks/
│   │   └── useDebounce.js          # Debounce hook
│   ├── pages/                      # Next.js pages (routes)
│   │   ├── _app.jsx                # App wrapper
│   │   ├── _document.jsx           # HTML document
│   │   └── index.jsx               # Main dashboard page
│   ├── services/
│   │   └── api.js                  # API client
│   ├── store/                      # Redux state management
│   │   ├── index.js                # Store configuration
│   │   └── slices/
│   │       └── filtersSlice.js     # Filters state slice
│   ├── styles/
│   │   └── globals.css             # Global styles
│   └── utils/
│       └── query.js                # Query parameter utilities
├── .next/                          # Next.js build output
├── .gitignore                      # Git ignore rules
├── package.json                    # Dependencies & scripts
├── postcss.config.js               # PostCSS configuration
├── tailwind.config.js              # Tailwind CSS configuration
└── REDUX_IMPLEMENTATION.md         # Redux documentation
```

### Root Structure
```
RSMS/
├── backend/                        # Node.js + Express API
├── frontend/                       # Next.js React app
├── docs/
│   └── architecture.md             # This document
└── README.md                       # Project overview
```

---

## Module Responsibilities

### Backend Modules

#### **1. index.js (Server Bootstrap)**
**Responsibilities:**
- Initialize Express application
- Load environment variables
- Configure middleware (CORS, JSON parser)
- Mount routes to `/api` prefix
- Connect to MongoDB
- Start HTTP server
- Handle graceful shutdown

**Dependencies:** express, dotenv, cors, db.js, salesRoutes.js

---

#### **2. routes/salesRoutes.js (API Routing)**
**Responsibilities:**
- Define RESTful endpoints
- Map HTTP methods to controller functions
- URL pattern matching
- Route-level middleware (if needed)

**Endpoints:**
- `GET /api/sales` → getSales
- `GET /api/sales/:id` → getSaleById
- `GET /api/filters` → getFilters

**Dependencies:** express.Router, salesController.js

---

#### **3. controllers/salesController.js (Request Handling)**
**Responsibilities:**
- Extract and validate request parameters
- Call appropriate service methods
- Format responses as JSON
- Handle errors with proper HTTP status codes
- Send responses back to client

**Functions:**
- `getSales(req, res)` - Handles query params, returns paginated data
- `getSaleById(req, res)` - Validates ID param, returns single record or 404
- `getFilters(req, res)` - Returns filter metadata

**Dependencies:** salesService.js

---

#### **4. services/salesService.js (Business Logic)**
**Responsibilities:**
- Implement core business logic
- Build complex MongoDB queries
- Parse and validate query parameters
- Handle multi-value filters (CSV parsing)
- Implement pagination math (skip/limit)
- Execute aggregations
- Transform data if needed
- Return structured responses

**Functions:**
- `fetchSales(query)` - Main query builder with filters/sort/pagination
- `fetchSaleById(id)` - Single record retrieval
- `fetchFilters()` - Aggregate distinct values for filters
- `parseCSVParam(param)` - Utility to split comma-separated values

**Query Capabilities:**
- Text search (name, phone)
- Multi-select filters (region, gender, category, tags, payment)
- Range filters (age, date)
- Sorting (multiple fields, asc/desc)
- Pagination (page, limit)

**Dependencies:** Sale model (Mongoose)

---

#### **5. models/Sale.js (Data Model)**
**Responsibilities:**
- Define MongoDB schema structure
- Set field types and constraints
- Create indexes for performance
- Define text indexes for search
- Enforce data consistency

**Schema Fields (25+ fields):**
- Transaction: transactionId, date
- Customer: customerId, customerName, phoneNumber, gender, age, customerRegion, customerType
- Product: productId, productName, brand, productCategory, tags
- Pricing: quantity, pricePerUnit, discountPercentage, totalAmount, finalAmount
- Order: paymentMethod, orderStatus, deliveryType
- Store: storeId, storeLocation, salespersonId, employeeName

**Indexes:**
- transactionId (single field)
- customerName + phoneNumber (text index)

**Dependencies:** mongoose

---

#### **6. utils/db.js (Database Connection)**
**Responsibilities:**
- Establish MongoDB connection
- Handle connection errors
- Implement retry logic
- Monitor connection state
- Graceful shutdown handling
- Log connection events

**Configuration:**
- Uses MONGO_URI from environment
- Mongoose v7+ connection (no deprecated options)
- Event listeners: disconnected, error
- SIGINT handler for cleanup

**Dependencies:** mongoose, process.env

---

#### **7. utils/importCsv.js (Data Seeding)**
**Responsibilities:**
- Read CSV file from filesystem
- Parse CSV rows
- Transform data (date parsing, tag splitting)
- Bulk insert into MongoDB
- Handle import errors
- Log import progress

**Process:**
1. Read truestate_assignment_dataset.csv
2. Parse each row with csv-parser
3. Transform dates (DD-MM-YYYY → Date object)
4. Split comma-separated tags
5. Batch insert using Sale.insertMany()
6. Report success/failure

**Dependencies:** csv-parser, fs, Sale model

---

### Frontend Modules

#### **1. pages/index.jsx (Main Dashboard)**
**Responsibilities:**
- Orchestrate entire dashboard UI
- Fetch initial data (sales + filters)
- Manage loading states
- Compute page-level summary metrics
- Handle search debouncing
- Integrate all child components
- Manage side effects (data fetching)

**State Management:**
- Redux selectors for filters/sorting/pagination
- Local state for data, loading, meta

**Effects:**
- Fetch filters on mount
- Fetch sales data when filters/page/sort change
- Debounce search input

**Dependencies:** React, Redux hooks, api.js, all components

---

#### **2. pages/_app.jsx (App Container)**
**Responsibilities:**
- Wrap entire app with providers
- Initialize Redux store
- Apply global layout
- Handle page transitions
- Persist state across routes

**Dependencies:** Redux Provider, store.js

---

#### **3. pages/_document.jsx (HTML Structure)**
**Responsibilities:**
- Customize HTML document structure
- Add meta tags
- Load external fonts/scripts
- Configure viewport settings

**Dependencies:** Next.js Document API

---

#### **4. store/index.js (Redux Store)**
**Responsibilities:**
- Configure Redux store
- Combine reducers
- Apply middleware
- Configure DevTools
- Disable serializable checks (for dates)

**Configuration:**
- Reducer: filters slice
- Middleware: default + custom settings

**Dependencies:** @reduxjs/toolkit, filtersSlice.js

---

#### **5. store/slices/filtersSlice.js (State Management)**
**Responsibilities:**
- Define application state shape
- Implement state update logic (reducers)
- Provide action creators
- Export selectors for component access
- Handle automatic page resets

**State Sections:**
- search (string)
- filters (object with arrays & strings)
- sorting (sortBy, sortOrder)
- pagination (page, limit)

**Actions:**
- setSearch, toggleFilter, setFilterValue, setMultipleFilters
- setSorting, setPage, setLimit
- resetAllFilters

**Side Effects:**
- Auto-reset page to 1 when filters/search/sort change

**Dependencies:** @reduxjs/toolkit

---

#### **6. components/Sidebar.jsx (Filter Panel)**
**Responsibilities:**
- Render all filter controls
- Dispatch filter updates to Redux
- Handle multi-select checkboxes
- Age range sliders
- Date pickers
- Clear all functionality
- Responsive drawer for mobile

**Dependencies:** Redux hooks, filtersSlice actions

---

#### **7. components/SalesTable.jsx (Data Grid)**
**Responsibilities:**
- Render sales data in table format
- Handle horizontal scrolling
- Format currency and dates
- Copy phone numbers to clipboard
- Emit row click events
- Sticky table headers
- Handle empty states

**Features:**
- 18 columns with custom widths
- Currency formatting (₹ symbol)
- Date formatting (locale-specific)
- Copy feedback (5s timeout)
- Clickable rows

**Dependencies:** React hooks, lucide-react

---

#### **8. components/SummaryCards.jsx (Metrics Display)**
**Responsibilities:**
- Display aggregated metrics
- Format large numbers
- Responsive card grid
- Icon integration

**Metrics:**
- Total Units (sum of quantities)
- Total Amount (sum of totalAmount)
- Total Discount (calculated discount)

**Dependencies:** Icons, amount formatting

---

#### **9. components/Pagination.jsx (Navigation)**
**Responsibilities:**
- Display current page
- Previous/Next buttons
- Disable buttons at boundaries
- Dispatch page change actions

**Dependencies:** Redux hooks, setPage action

---

#### **10. services/api.js (HTTP Client)**
**Responsibilities:**
- Configure Axios instance
- Set base URL from environment
- Define timeout
- Export API methods
- Handle request/response interceptors (if needed)

**API Methods:**
- `getSales(params)` - GET with query params
- `getSaleById(id)` - GET by ID
- `getFilters()` - GET filters metadata

**Configuration:**
- Base URL: NEXT_PUBLIC_API_BASE || http://localhost:4000/api
- Timeout: 15s

**Dependencies:** axios

---

#### **11. hooks/useDebounce.js (Performance Hook)**
**Responsibilities:**
- Debounce rapidly changing values
- Prevent excessive API calls
- Cleanup timers on unmount
- Configurable delay

**Usage:**
- Debounce search input (350ms)
- Reduce API request frequency
- Improve performance

**Dependencies:** React (useState, useEffect)

---

#### **12. utils/query.js (Query Builder)**
**Responsibilities:**
- Clean query parameters
- Remove undefined/null values
- Remove empty strings
- Prevent invalid query strings

**Function:**
- `buildQuery(params)` - Returns sanitized object

**Dependencies:** None

---

#### **13. components/TopBar.jsx (Navigation Bar)**
**Responsibilities:**
- Display app branding
- Mobile menu toggle
- User profile section
- Responsive layout

**Dependencies:** Icons, mobile state

---

#### **14. components/Filters.jsx & FiltersDropdown.jsx**
**Responsibilities:**
- Reusable filter UI components
- Checkbox groups
- Dropdown menus
- State binding to Redux

**Dependencies:** Redux hooks, Icons

---

#### **15. components/Icons.jsx (Icon Library)**
**Responsibilities:**
- Wrap lucide-react icons
- Provide consistent icon API
- Export commonly used icons

**Dependencies:** lucide-react

---

### Module Interaction Summary

**Backend Flow:**
```
Request → Routes → Controllers → Services → Models → Database
                                          ↓
                               Response ← ← ← ←
```

**Frontend Flow:**
```
User Input → Component → Redux Action → State Update → Selector
                                                         ↓
                                                     Re-render
                                                         ↓
                                                    useEffect
                                                         ↓
                                                    API Call
                                                         ↓
                                                    Backend
                                                         ↓
                                                    Response
                                                         ↓
                                                 Update State
                                                         ↓
                                                    Re-render
```

**Full Stack Integration:**
```
[UI Component] → [Redux] → [API Service] → [Backend Controller] 
                                              ↓
                                         [Service Layer]
                                              ↓
                                         [MongoDB Model]
                                              ↓
                                         [Database]
```

---

## Design Principles & Best Practices

### Backend
1. **Separation of Concerns:** Routes, controllers, services, models are distinct
2. **Single Responsibility:** Each module has one clear purpose
3. **Error Handling:** Try-catch blocks with appropriate HTTP codes
4. **Validation:** Input validation at service layer
5. **Performance:** Database indexes on frequently queried fields
6. **Scalability:** Stateless API design, horizontal scaling ready
7. **Security:** CORS configured, environment variables for secrets

### Frontend
1. **State Management:** Centralized Redux store, single source of truth
2. **Component Reusability:** Small, focused components
3. **Performance:** Debouncing, memoization, code splitting
4. **Type Safety:** Prop validation (can be enhanced with TypeScript)
5. **Responsive Design:** Mobile-first with Tailwind CSS
6. **Accessibility:** Semantic HTML, keyboard navigation
7. **Developer Experience:** Clear folder structure, documented code

---

## Future Enhancements

### Backend
- Add authentication/authorization (JWT)
- Implement caching (Redis)
- Add request rate limiting
- Implement comprehensive logging (Winston)
- Add API versioning
- Write unit/integration tests
- Add data validation (Joi/Yup)
- Implement GraphQL endpoint

### Frontend
- Add TypeScript for type safety
- Implement URL state synchronization
- Add export functionality (CSV/PDF)
- Implement advanced charts/visualizations
- Add real-time updates (WebSockets)
- Implement offline support (PWA)
- Add E2E tests (Cypress/Playwright)
- Optimize bundle size

---

## Conclusion

RSMS follows modern full-stack architecture patterns with clear separation of concerns, centralized state management, and robust data flow. The modular design ensures maintainability, scalability, and ease of testing. Each module has well-defined responsibilities, making the system easy to understand and extend.

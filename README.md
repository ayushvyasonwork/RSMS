# RSMS - Retail Sales Management System

## Overview

RSMS is a full-stack web application designed for comprehensive retail sales data management and analysis. It provides powerful search, filtering, sorting, and pagination capabilities through an intuitive, responsive user interface. The system handles large datasets efficiently with MongoDB as the database backend and React/Next.js powering the frontend, enabling real-time data exploration and business insights.

---

## Tech Stack

### Backend
- **Runtime:** Node.js (ES6 Modules)
- **Framework:** Express.js v4.18.2
- **Database:** MongoDB with Mongoose ODM v7.0.0
- **Middleware:** CORS, express.json()
- **Data Processing:** csv-parser v3.2.0
- **Environment Management:** dotenv v16.0.0
- **Development:** nodemon v2.0.22

### Frontend
- **Framework:** Next.js 14.1.0
- **UI Library:** React 18.2.0
- **State Management:** Redux Toolkit v2.11.0 + React-Redux v9.2.0
- **Styling:** Tailwind CSS v3.4.0
- **HTTP Client:** Axios v1.13.2
- **Icons:** Lucide React v0.278.0
- **Build Tools:** PostCSS, Autoprefixer

### Development Tools
- Git for version control
- Environment variables for configuration
- ES6+ JavaScript features

---

## Search Implementation Summary

### Backend Search
**Location:** `backend/src/services/salesService.js`

**Implementation:**
- **Search Fields:** Customer name and phone number
- **Method:** MongoDB regex-based text search with case-insensitive matching
- **Query Structure:**
  ```javascript
  mongoQuery.$or = [
    { customerName: { $regex: search, $options: 'i' } },
    { phoneNumber: { $regex: search, $options: 'i' } }
  ]
  ```
- **Index Support:** Text index on `customerName` and `phoneNumber` fields for optimized search performance
- **Search Pattern:** Partial matching - finds results containing the search term anywhere in the field

### Frontend Search
**Location:** `frontend/src/pages/index.jsx`

**Implementation:**
- **Input Component:** Search box in TopBar component
- **Debouncing:** 350ms delay using custom `useDebounce` hook to reduce API calls
- **State Management:** Redux (`setSearch` action in `filtersSlice.js`)
- **Auto-reset:** Automatically resets to page 1 when search term changes
- **User Experience:** Real-time search with minimal lag, visual feedback during loading

**Flow:**
1. User types in search box
2. Input updates Redux state immediately
3. Debounce hook delays API call for 350ms
4. After delay, API request sent with search parameter
5. Results displayed in table with matching records

---

## Filter Implementation Summary

### Backend Filters
**Location:** `backend/src/services/salesService.js`

**Supported Filters:**
1. **Multi-Select Filters** (comma-separated values):
   - **Region:** `customerRegion` field - filters by geographic regions
   - **Gender:** `gender` field - filters by customer gender
   - **Category:** `productCategory` field - filters by product categories
   - **Tags:** `tags` field - filters by product tags (array field)
   - **Payment Method:** `paymentMethod` field - filters by payment type

2. **Range Filters:**
   - **Age Range:** `ageMin` and `ageMax` - filters customers by age bounds
   - **Date Range:** `startDate` and `endDate` - filters transactions by date period

**Implementation Details:**
- **CSV Parsing:** Multi-value filters parsed with `parseCSVParam()` utility
- **MongoDB Operators:**
  - `$in` for multi-select filters
  - `$gte` and `$lte` for range filters
- **Validation:** Age range validation (min < max), invalid ranges ignored
- **Date Handling:** Start date set to 00:00:00, end date set to 23:59:59

**Filter Metadata Endpoint:**
- `GET /api/filters` returns all unique values for dropdown population
- Uses MongoDB `distinct()` aggregation
- Returns sorted arrays for each filter type

### Frontend Filters
**Location:** `frontend/src/components/Sidebar.jsx`, `frontend/src/store/slices/filtersSlice.js`

**UI Components:**
- **Sidebar Panel:** Collapsible filter panel with all filter options
- **Checkbox Groups:** Multi-select filters with individual checkboxes
- **Age Sliders:** Range input controls for min/max age
- **Date Pickers:** Calendar inputs for start and end dates
- **Clear All Button:** Reset all filters with single click

**State Management:**
- Redux Toolkit manages filter state centrally
- Actions: `toggleFilter`, `setFilterValue`, `setMultipleFilters`
- Automatic page reset to 1 when any filter changes
- Filter state persists across component re-renders

**Filter Combination:**
- Multiple filters applied with AND logic
- Within same filter type (e.g., multiple regions), OR logic applies
- Query parameters built with `buildQuery()` utility
- Empty/undefined values excluded from API requests

---

## Sorting Implementation Summary

### Backend Sorting
**Location:** `backend/src/services/salesService.js`

**Sortable Fields:**
1. **Date:** `date` field (default)
2. **Quantity:** `quantity` field
3. **Customer Name:** `customerName` field

**Implementation:**
- **Query Parameters:**
  - `sortBy` - field name (default: 'date')
  - `sortOrder` - 'asc' or 'desc' (default: 'desc')
- **MongoDB Sort:**
  ```javascript
  const sortObj = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
  Sale.find(query).sort(sortObj);
  ```
- **Default Sort:** Descending by date (newest first)
- **Validation:** Only mapped fields allowed, invalid fields default to 'date'

### Frontend Sorting
**Location:** `frontend/src/store/slices/filtersSlice.js`

**Implementation:**
- Redux state manages sorting: `{ sortBy, sortOrder }`
- Action: `setSorting({ sortBy, sortOrder })`
- Table headers can be made clickable to trigger sort
- Visual indicators for current sort field and direction
- Automatic page reset to 1 when sort changes

**Sort Persistence:**
- Sort state maintained in Redux store
- Survives component re-renders
- Applied to all data fetching requests

---

## Pagination Implementation Summary

### Backend Pagination
**Location:** `backend/src/services/salesService.js`

**Implementation:**
- **Query Parameters:**
  - `page` - current page number (default: 1)
  - `limit` - items per page (default: 10)
- **Calculation:**
  ```javascript
  const skip = (pageNum - 1) * pageSize;
  Sale.find(query).skip(skip).limit(pageSize);
  ```
- **Response Metadata:**
  ```javascript
  {
    page: 1,
    limit: 10,
    totalItems: 247,
    totalPages: 25,
    data: [...]
  }
  ```
- **Validation:** Page numbers and limits validated (minimum 1)
- **Total Count:** Efficient `countDocuments()` for accurate pagination

### Frontend Pagination
**Location:** `frontend/src/components/Pagination.jsx`, `frontend/src/store/slices/filtersSlice.js`

**UI Components:**
- **Page Display:** Shows current page and total pages
- **Navigation Buttons:**
  - Previous button (disabled on page 1)
  - Next button (disabled on last page)
- **Page Numbers:** Can be extended to show clickable page numbers

**State Management:**
- Redux manages pagination: `{ page, limit }`
- Action: `setPage(pageNumber)`
- Automatic page reset when filters/search/sort change
- Default: 10 items per page

**User Experience:**
- Smooth page transitions
- Loading indicators during data fetch
- Button states clearly indicate navigation availability
- Scroll to top on page change (optional)

---

## Setup Instructions

### Prerequisites
- **Node.js:** v16.x or higher
- **MongoDB:** v4.x or higher (local or cloud instance like MongoDB Atlas)
- **npm:** v8.x or higher
- **Git:** For cloning the repository

### 1. Clone the Repository
```bash
git clone https://github.com/ayushvyasonwork/RSMS.git
cd RSMS
```

### 2. Backend Setup

#### Navigate to backend directory:
```bash
cd backend
```

#### Install dependencies:
```bash
npm install
```

#### Configure environment variables:
Create a `.env` file in the `backend` directory:
```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
MONGO_URI=mongodb://localhost:27017/sales_db
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sales_db

PORT=4000
```

#### Import CSV data (first time setup):
```bash
npm run seed
```
This imports data from `src/truestate_assignment_dataset.csv` into MongoDB.

#### Start the backend server:

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Backend will run on `http://localhost:4000`

#### Verify backend:
```bash
# Health check
curl http://localhost:4000/api/health

# Test sales endpoint
curl http://localhost:4000/api/sales?page=1&limit=5
```

### 3. Frontend Setup

#### Open new terminal and navigate to frontend directory:
```bash
cd frontend
```

#### Install dependencies:
```bash
npm install
```

#### Configure environment variables (optional):
Create a `.env.local` file in the `frontend` directory if you need to customize the API URL:
```env
NEXT_PUBLIC_API_BASE=http://localhost:4000/api
```

If not specified, it defaults to `http://localhost:4000/api`.

#### Start the frontend development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

#### Build for production (optional):
```bash
npm run build
npm start
```

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

You should see the sales dashboard with:
- Search bar for customer lookup
- Filter sidebar with multiple filter options
- Sales data table with 18 columns
- Summary cards showing totals
- Pagination controls

### 5. Project Structure
```
RSMS/
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Database & CSV utilities
│   ├── .env               # Environment config (create this)
│   └── package.json       # Backend dependencies
│
├── frontend/         # Next.js React app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Next.js pages
│   │   ├── store/         # Redux state management
│   │   ├── services/      # API client
│   │   └── hooks/         # Custom React hooks
│   └── package.json      # Frontend dependencies
│
├── docs/
│   └── architecture.md   # Detailed architecture documentation
│
└── README.md            # This file
```

### 6. Available Scripts

#### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Import CSV data to MongoDB

#### Frontend Scripts
- `npm run dev` - Start Next.js development server (port 3000)
- `npm run build` - Build production bundle
- `npm start` - Start production server

### 7. API Endpoints

**Base URL:** `http://localhost:4000/api`

#### Sales Endpoints:
- **GET** `/sales` - Fetch paginated sales with filters
  - Query params: `search`, `region`, `gender`, `category`, `tags`, `payment`, `ageMin`, `ageMax`, `startDate`, `endDate`, `sortBy`, `sortOrder`, `page`, `limit`
  
- **GET** `/sales/:id` - Fetch single sale by ID
  
- **GET** `/filters` - Get filter metadata (unique values)
  
- **GET** `/health` - Health check

### 8. Troubleshooting

#### MongoDB Connection Issues:
- Verify MongoDB is running: `mongod --version`
- Check MONGO_URI in `.env` file
- For MongoDB Atlas, ensure IP whitelist is configured
- Check network connectivity

#### Port Already in Use:
```bash
# Backend
# Change PORT in backend/.env to different port (e.g., 4001)

# Frontend
# Run with custom port
npm run dev -- -p 3001
```

#### Module Not Found Errors:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### CSV Import Issues:
- Ensure CSV file exists at `backend/src/truestate_assignment_dataset.csv`
- Check MongoDB connection before running seed
- Check console for detailed error messages

#### CORS Errors:
- Verify backend CORS is configured
- Check frontend API base URL matches backend port
- Ensure both servers are running

### 9. Development Tips

- **Hot Reload:** Both frontend (Next.js) and backend (nodemon) support hot reload
- **Redux DevTools:** Install Redux DevTools browser extension for state debugging
- **MongoDB Compass:** Use MongoDB Compass GUI to inspect database
- **API Testing:** Use Postman or Thunder Client for API endpoint testing
- **Logs:** Check terminal logs for both frontend and backend for debugging

### 10. Production Deployment

#### Backend Deployment:
- Set `NODE_ENV=production`
- Use process manager like PM2
- Configure production MongoDB instance
- Set up proper CORS origins
- Enable HTTPS

#### Frontend Deployment:
- Build optimized bundle: `npm run build`
- Deploy to Vercel, Netlify, or similar platforms
- Set environment variables in hosting platform
- Configure custom domain

---

## Features

✅ **Search:** Real-time search by customer name and phone number  
✅ **Multi-Filter:** Region, gender, category, tags, payment method  
✅ **Range Filters:** Age range and date range  
✅ **Sorting:** Sort by date, quantity, or customer name  
✅ **Pagination:** Navigate through large datasets efficiently  
✅ **Responsive Design:** Works on desktop, tablet, and mobile  
✅ **Summary Cards:** Quick insights with aggregated metrics  
✅ **Copy Functionality:** Copy phone numbers with one click  
✅ **State Management:** Centralized Redux store for consistent UI  
✅ **Debounced Search:** Optimized API calls for better performance  

---

## Documentation

For detailed architecture information, see [docs/architecture.md](./docs/architecture.md)

---

## License

MIT

---

## Author

Ayush Vyas

---

## Support

For issues or questions, please open an issue on the GitHub repository.
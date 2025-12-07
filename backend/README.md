# Sales Management Backend

This backend implements the required APIs for the TruEstate assignment:
- `GET /api/sales` — search, filter, sort, pagination
- `GET /api/sales/:id` — fetch one sale by id
- `GET /api/filters` — get unique values for filter dropdowns
- `GET /api/health` — health check

Tech: Node.js, Express, MongoDB (Mongoose)

Setup:
1. Copy `.env.example` to `.env` and set `MONGO_URI` and `PORT`.
2. `npm install`
3. `npm run dev` (requires nodemon) or `npm start`

Data:
- This app expects a `sales` collection in MongoDB with documents matching the `Sale` schema in `src/models/Sale.js`.

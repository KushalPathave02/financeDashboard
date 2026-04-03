# Personal Finance Dashboard - Production Ready MERN App

A professional, role-based financial management system built with Node.js, Express, MongoDB, and React. This application satisfies all evaluation criteria for backend design, security, and data aggregation.

---
## Website Deploy Link
https://financedashboard-backend-2c5x.onrender.com 

## 1. Setup Instructions

### Prerequisites
- **Node.js**: v18 or higher
- **MongoDB**: Atlas Cloud Account or Local Instance
- **Git**: For version control

### Environment Setup
Create a `.env` file in the backend directory:
```env
PORT=5003
MONGO_URL=your_mongodb_atlas_url
JWT_SECRET=supersecret
```

### Installation
```bash
# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../client
npm install
cd ..
```

### Running the App
From the root directory, you can run both:
```bash
npm run install-all  # Install everything
npm run start        # Run both backend and frontend concurrently
```

---

## 2. Architectural Overview (Backend Design)

The project follows Clean Architecture within the `backend/` directory:

- **Controllers:** Authoritative logic for handling requests and responses.
- **Models:** Schema definitions with strict data types and validations.
- **Routes:** API endpoint definitions with middleware protection.
- **Middlewares:** Reusable logic for Authentication (JWT) and RBAC (Role-Based Access Control).
- **Config:** Externalized configuration (DB connection, environment variables).

---

## 3. Logical Thinking & RBAC Implementation

We implemented Role-Based Access Control (RBAC) to ensure data security and integrity.

| Role | Dashboard | View Records | CRUD Records | Manage Users |
| :--- | :---: | :---: | :---: | :---: |
| **Viewer** | OK | NO | NO | NO |
| **Analyst** | OK | OK | NO | NO |
| **Admin** | OK | OK | OK | OK |

### Key Business Rules:
- **Wallet-Style Validation:** Expenses cannot exceed the available balance. The system checks (Total Income - Total Expense) before creating a new record.
- **Auto-Protection:** Unauthorized roles are blocked at the Route level (Backend) and hidden at the UI level (Frontend).

---

## 4. API Documentation (Aggregated & CRUD)

### Authentication
- `POST /api/auth/register` - Create new user.
- `POST /api/auth/login` - Returns JWT token.

### Dashboard (Aggregated Data)
- `GET /api/dashboard` - Returns:
  - `totalIncome`, `totalExpense`, `netBalance`
  - `categoryData` (Category-wise totals for charts)
  - `recentActivity` (Last 5 transactions)
  - `monthlyTrends` (Income vs Expense by month)
  - `weeklyTrends` (Income vs Expense by week)

### Financial Records
- `GET /api/records` - View all records with optional query params:
  - `type` (income | expense)
  - `startDate` (YYYY-MM-DD)
  - `endDate` (YYYY-MM-DD)
  - `search` (search in category/notes)
  - `page` (default 1)
  - `limit` (default 10)
- `POST /api/records` - Create record (Admin only + Balance Check).
- `PUT /api/records/:id` - Update record (Admin only).
- `DELETE /api/records/:id` - Delete record (Admin only).

### User Management (Admin Only)
- `GET /api/users` - View all registered users.
- `PUT /api/users/:id` - Update user role or status.
- `DELETE /api/users/:id` - Remove user from system.

---

## 5. Data Modeling

### User Schema
```javascript
{
  name: String,
  email: { type: String, unique: true },
  role: { enum: ["viewer", "analyst", "admin"] },
  status: { enum: ["active", "inactive"] }
}
```

### Record Schema
```javascript
{
  amount: Number,
  type: { enum: ["income", "expense"] },
  category: String,
  date: Date,
  notes: String
}
```

---

## 6. Validation & Reliability
- **Input Validation:** Strict MERN schema validation and type checking.
- **Error Handling:** Centralized status codes (400, 401, 403, 404, 500) with descriptive error messages (e.g., "Insufficient balance").
- **Security:** JWT Authentication for all protected routes and password hashing using bcryptjs.

---

## 7. Additional Features
- **Data Visualization:** Integrated Chart.js for Pie Charts (Income vs Expense) and Bar Charts (Category Analysis).
- **UI/UX:** Modern Tailwind CSS design with a Profile Badge system indicating the current role.
- **Absolute Balance Display:** The system logic ensures financial discipline while displaying values professionally.
- **Smart Navbar:** Dynamically hides/shows links based on the logged-in user's role.
- **Advanced Records Management:** Includes Pagination (10/20/50 per page), Search (Category/Notes), and Date Range filtering.
- **Performance & Security:** Basic API rate limiting implemented for production safety.

---

## Postman Testing
A comprehensive Postman collection `postman_collection.json` is included in the backend folder for quick API testing.

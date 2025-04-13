# Juice Shop Management System - Backend API

[Node.js] [Express] [MongoDB] [JWT]

This project provides a RESTful API for a juice shop management system with three user roles:
- **Admin** (Manages shopkeepers & customers)
- **Shopkeeper** (Sells juices, manages shop)
- **Customer** (Navigate shop on map, Orders juices)

## Table of Contents
- [Models](#-models)
- [Authentication](#-authentication--security)
- [Controllers](#-controllers)
- [Utilities](#-utilities)
- [Setup & Usage](#-setup--usage)
- [License](#-license)

## 📂 Models

### 1. Admin (`models/Admin.js`)
Manages platform administrators.

**Fields:**
- `name`, `email`, `password` (hashed)
- `role` (fixed as `'admin'`)
- `profilePic`, `mobileNumber` (optional)
- `createdAt`, `updatedAt`, `passwordChangedAt`

**Features:**
- Password hashing (bcrypt)
- Email & phone validation
- JWT token generation

### 2. Customer (`models/Customer.js`)
Represents juice buyers.

**Fields:**
- `name`, `email`, `password` (hashed)
- `profilePic`, `mobileNumber` (optional)
- `orders` (references to `Order` model)

**Features:**
- Secure password handling
- Profile updates (excluding password)
- Order history tracking

### 3. Shopkeeper (`models/Shopkeeper.js`)
Manages juice shops (requires admin approval).

**Fields:**
- `name`, `shopName`, `email`, `password`
- `licenseNumber` (unique, required)
- `address` (geospatial `Point` for location)
- `active` (false until approved by admin)

**Features:**
- Geospatial indexing (`2dsphere`) for location-based queries
- Admin approval flow

## 🔑 Authentication & Security
- **JWT-based authentication** (Bearer tokens)
- Password reset via email (if implemented)
- Role-based access control (`admin`, `shopkeeper`, `customer`)
- Rate limiting & brute-force protection (recommended)

## 🛠️ Controllers

### 1. Admin Controller (`controllers/adminController.js`)

| Endpoint                          | Method | Description                          | Access       |
|-----------------------------------|--------|--------------------------------------|--------------|
| `/api/admin/signup`               | POST   | Create first admin (one-time)        | Private*     |
| `/api/admin/login`                | POST   | Admin login                          | Public       |
| `/api/admin/pending-registrations`| GET    | List unapproved shopkeepers          | Admin        |
| `/api/admin/approve-shopkeeper/:id`| PATCH | Approve shopkeeper                   | Admin        |
| `/api/admin/reject-shopkeeper/:id`| DELETE | Reject shopkeeper                    | Admin        |
| `/api/admin/shopkeepers`          | GET    | List all shopkeepers                 | Admin        |
| `/api/admin/customers`            | GET    | List all customers                   | Admin        |

**Middleware:**
- `protect` (JWT verification)
- `restrictToAdmin` (role check)

### 2. Customer Controller (`controllers/customerController.js`)

| Endpoint                          | Method | Description                          | Access       |
|-----------------------------------|--------|--------------------------------------|--------------|
| `/api/customers/signup`           | POST   | Customer registration                | Public       |
| `/api/customers/login`            | POST   | Customer login                       | Public       |
| `/api/customers/me`               | GET    | Get customer profile                 | Customer     |
| `/api/customers/updateMe`         | PATCH  | Update profile (non-password fields) | Customer     |
| `/api/customers/order-juice`      | POST   | Place juice order                    | Customer     |
| `/api/customers/my-orders`        | GET    | View order history                   | Customer     |

**Middleware:**
- `protect` (JWT verification)

### 3. Shopkeeper Controller (`controllers/shopkeeperController.js`)

| Endpoint                          | Method | Description                          | Access       |
|-----------------------------------|--------|--------------------------------------|--------------|
| `/api/shopkeepers/signup`         | POST   | Register (pending approval)          | Public       |
| `/api/shopkeepers/login`          | POST   | Login (approved shopkeepers only)    | Public       |
| `/api/shopkeepers/me`             | GET    | Get shopkeeper profile               | Shopkeeper   |
| `/api/shopkeepers/update-location`| PATCH  | Update shop location (geospatial)    | Shopkeeper   |
| `/api/shopkeepers/update-password`| PATCH  | Change password                      | Shopkeeper   |

**Middleware:**
- `protect` (JWT + active account check)

## 🔧 Utilities
- **Error Handling**: Custom `AppError` class
- **Async Wrapper**: `catchAsync` for async/await error handling
- **Email Service**: Nodemailer integration (approval/rejection emails)

## 🚀 Setup & Usage

1. **Environment Variables**:
   ```env
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=90d
   MONGODB_URI=mongodb://localhost:27017/juice_shop
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USERNAME=user@example.com
   EMAIL_PASSWORD=password


##  Install Dependencies:
   - `npm install bcryptjs validator jsonwebtoken mongoose nodemailer`

## Run the Server:
   - `npm run dev`
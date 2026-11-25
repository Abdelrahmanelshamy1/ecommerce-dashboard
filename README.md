# Souqly 🛍️

A responsive e-commerce storefront and admin dashboard built with React and the DummyJSON API.

**Live demo:** https://souqly-store.vercel.app

**Test login:** username `emilys`, password `emilyspass`

## Features

### Authentication
- Login with input validation; the token is saved in localStorage
- The logged-in user is loaded on refresh (`/auth/me`) and shown in the navbar
- Mock registration (`/users/add`)
- Protected routes for the cart and the dashboard

### Products
- Product list with pagination (limit/skip)
- Search, category filter and sorting (price, name, rating)
- Product details page with image gallery, reviews and related products
- Loading placeholders (skeletons)

### Cart (Redux Toolkit)
- Add to cart (login required)
- Quantity +/- limited by the product's stock
- Remove items, live totals, checkout

### Dashboard
- **Products:** list, add, edit, delete
- **Carts:** list, filter by user ID, view a single cart, add, update, delete
- **Users:** list, search, filter by gender, pagination, view details, add, edit, delete

> Note: DummyJSON is a mock API. Add, update and delete requests return a response but are not saved on the server, so the app updates its own state to show the changes.

## Tech stack
- React 19 + Vite
- React Router
- Redux Toolkit
- React Bootstrap + Bootstrap 5
- Axios
- React Hot Toast
- React Icons

## Project structure
```
src/
  api/          axios instance (base URL)
  components/   navbar, product card, placeholders, protected route...
  pages/        Home, Products, ProductDetails, Cart, Login, Register, NotFound
  pages/dashboard/  DashboardProducts, DashboardCarts, DashboardUsers
  store/        Redux store + slices (auth, cart)
  styles/       design system (CSS variables)
```

## Run locally
```bash
git clone https://github.com/Abdelrahmanelshamy1/ecommerce-dashboard.git
cd ecommerce-dashboard
npm install
npm run dev
```

## Author
Abdelrahman Elshamy
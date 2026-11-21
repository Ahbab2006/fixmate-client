# FixMate — Premium Home Service Booking Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.7-6366f1?style=flat)](https://www.better-auth.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payment_Integration-635bff?style=flat&logo=stripe)](https://stripe.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47a248?style=flat&logo=mongodb)](https://www.mongodb.com/)

**FixMate** is a full-stack, role-based web application connecting homeowners with background-verified repair specialists. From smartphone and laptop repairs to home appliances and electrical maintenance, FixMate provides a structured platform featuring transparent pricing, real-time booking status management, and secure digital checkout.

---

## Table of Contents

- [Overview & Problem Solved](#overview--problem-solved)
- [Key Features by Role](#key-features-by-role)
  - [Customer Portal](#customer-portal)
  - [Technician Portal](#technician-portal)
  - [Administrator Control Center](#administrator-control-center)
- [Payment Configuration & Currency Policy](#payment-configuration--currency-policy)
- [Technology Stack](#technology-stack)
- [Project Architecture & Directory Structure](#project-architecture--directory-structure)
- [Installation & Local Setup](#installation--local-setup)
- [Environment Variables](#environment-variables)
- [Authentication & Social Sign-In](#authentication--social-sign-in)
- [Backend API Integration](#backend-api-integration)
- [Stripe Checkout & Testing Instructions](#stripe-checkout--testing-instructions)
- [Production Deployment Guide](#production-deployment-guide)
- [Repositories & Links](#repositories--links)

---

## Overview & Problem Solved

Finding dependable technicians for household repairs is frequently complicated by unpredictable pricing, unverified credentials, and cumbersome communication. 

**FixMate** resolves these pain points through:
1. **Curated & Admin-Approved Services:** Technicians publish services that undergo administrative review before appearing in the public catalog.
2. **Standardized Workflow:** Bookings follow a strict state progression: `requested` &rarr; `accepted` &rarr; `in-progress` &rarr; `completed` &rarr; `paid`.
3. **Transparent Post-Service Billing:** Technicians set a verified final amount upon completion, and customers settle the balance securely online.
4. **Verified Identities:** Role-based access guards customers, technicians, and administrators with authenticated sessions and JWT tokens.

---

## Key Features by Role

### Customer Portal
- **Service Discovery:** Search by keywords, browse 7 core categories, and filter by service mode (*Home Visit* vs. *Shop Drop-off*) and pricing order.
- **Detailed Service Dossiers:** View technician profiles, service coverage areas, base rates, and estimated durations.
- **Booking Submission:** Book requests with preferred dates, service addresses, contact phone numbers, and detailed issue descriptions.
- **Booking Management:** Track live status updates with the ability to cancel pending requests before technician acceptance.
- **Digital Invoicing & Checkout:** Instant redirection to Stripe Checkout for completed bookings, followed by automated verification and receipt generation.
- **Transaction Ledger:** Complete history of all settled payments with downloadable details and transaction timestamps.

### Technician Portal
- **Service Publishing Studio:** Create new repair offerings with category selection, image upload via ImgBB, base pricing, duration, and operational radius.
- **Service Catalog Management:** Update service details or toggle real-time availability on/off.
- **Booking Request Workflow:**
  - Accept or reject incoming client requests.
  - Advance bookings from *Accepted* to *In-Progress*.
  - Mark jobs as *Completed* and specify the final invoice amount for client payment.
- **Technician Metrics:** Real-time summary cards tracking approved services, pending review items, and active repair requests.

### Administrator Control Center
- **System Executive Briefing:** Real-time revenue analytics, transaction tallies, user demographic distribution, and platform health indicators.
- **Service Moderation:** Review technician service submissions with approval, rejection, and deletion controls.
- **Booking Supervision:** Monitor all historical and active bookings across the entire platform.
- **User Directory & RBAC:** View registered users and promote/demote account roles (`customer`, `technician`, `admin`).
- **Financial Audit Log:** Platform-wide transaction stream displaying Stripe session IDs, customer emails, amounts, and settlement dates.

---

## Payment Configuration & Currency Policy

### Target Customer Markets
FixMate is tailored for homeowners and service providers in two primary regions:
- **United States (US)**
- **Bangladesh (BD)**

### Standard Currency: USD ($)
- **Default & System-Wide Currency:** **United States Dollar (USD - `$` / `usd`)** is the standard currency across FixMate.
- **Pricing & Checkout Consistency:** Base service prices, final amounts calculated by technicians, Stripe Checkout line items, and payment ledgers are exclusively recorded and transacted in USD.
- **Multi-Country Accessibility:** Customers booking from either the US or Bangladesh are presented with unified USD pricing. International cards automatically handle local currency conversions at the bank exchange rate.

### Stripe Processing & Merchant Eligibility
- **Stripe Checkout:** FixMate leverages Stripe Checkout sessions for PCI-compliant, hosted credit and debit card handling.
- **Test Mode Development:** During development and evaluation, FixMate runs in **Stripe Test Mode**, enabling end-to-end checkout simulations without real monetary charges.
- **Merchant Availability Notice:** Stripe merchant account availability, direct bank payouts, and payment processing are subject to Stripe’s country-by-country eligibility guidelines. *Direct merchant account onboarding on Stripe requires registration in a Stripe-supported country (such as the United States); merchant payouts in unsupported regions require an eligible international business entity or partner provider.*

---

## Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16.4 (App Router)](https://nextjs.org/) with React 19 and Partial Prerendering (PPR) |
| **Language** | [TypeScript 5.x](https://www.typescriptlang.org/) (Strict type checking) |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/) with Turbopack CSS loaders and custom Editorial design tokens |
| **Typography** | Newsreader (Editorial Serif), Geist Sans (UI), Geist Mono (Tabular Data) |
| **Authentication** | [Better Auth 1.7](https://www.better-auth.com/) with MongoDB Adapter, JWT plugin, and Google OAuth 2.0 |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/) using the native MongoDB Node.js driver (`mongodb` v7) |
| **Payments** | [Stripe](https://stripe.com/) Checkout Sessions & server-side retrieval verification |
| **Forms & Validation** | React Hook Form, Zod schema validation |
| **Icons & UI** | Lucide React, React Icons (FcGoogle, FaFacebookF, FaInstagram, FaXTwitter), Sonner |
| **Media Hosting** | ImgBB API for technician service imagery and customer avatar uploads |

---

## Project Architecture & Directory Structure

```text
fixmate-client/
├── public/                     # Static media and assets
├── src/
│   ├── app/                    # Next.js App Router routes and pages
│   │   ├── (auth)/             # Authentication views
│   │   │   ├── login/          # Email/Password + Google Sign-In page
│   │   │   ├── sign-in/        # Sign-in alias with query redirection
│   │   │   └── sign-up/        # Customer & Technician registration
│   │   ├── about/              # Company narrative and platform mission
│   │   ├── api/auth/[...all]/  # Better Auth serverless API route handler
│   │   ├── dashboard/          # Protected role-based dashboard ecosystem
│   │   │   ├── admin/          # Admin metrics, services, bookings, users, transactions
│   │   │   ├── customer/       # Customer overview, bookings, payments
│   │   │   ├── technician/     # Technician overview, services, requests, service editor
│   │   │   ├── profile/        # Unified profile management with avatar uploads
│   │   │   └── layout.tsx      # Dashboard shell with responsive collapsible sidebar
│   │   ├── payment/
│   │   │   ├── cancel/         # Payment cancellation landing view
│   │   │   └── success/        # Stripe payment verification and digital receipt view
│   │   ├── services/           # Service catalog, detail dossier, and booking form
│   │   │   ├── [id]/           # Dynamic service overview
│   │   │   │   └── book/       # Customer booking submission form
│   │   │   └── page.tsx        # Searchable and filterable service directory
│   │   ├── globals.css         # Global design tokens, editorial palette, and theme rules
│   │   ├── layout.tsx          # Root layout, Google Font bindings, Sonner toast provider
│   │   └── page.tsx            # Public homepage with hero, categories, and workflow
│   ├── components/
│   │   └── shared/             # Reusable global components
│   │       ├── ConfirmationModal.tsx  # Accessible danger/warning modal dialog
│   │       ├── Footer.tsx             # Structured multi-column footer
│   │       └── Navbar.tsx             # Sticky header with authenticated user profile menu
│   └── lib/                    # Core configuration and client utilities
│       ├── api.ts              # API client helper resolving backend base URLs
│       ├── auth.ts             # Better Auth server configuration with MongoDB & Google
│       └── auth-client.ts      # Better Auth browser client with JWT & custom fields
├── next.config.ts              # Next.js build options, Turbopack, and Tailwind loaders
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript compiler configuration
└── README.md                   # Project documentation
```

---

## Installation & Local Setup

### Prerequisites
Before running FixMate locally, ensure you have:
- **Node.js**: v18.17.0 or higher (v20 LTS recommended)
- **npm** (or `pnpm` / `yarn`)
- **MongoDB Atlas** cluster or a local MongoDB database instance
- **FixMate Server**: Running backend service (defaulting to `http://localhost:5000`)
- **Google Cloud Console Credentials** (for Google OAuth)
- **ImgBB API Key** (for image upload features)
- **Stripe Account** in Test Mode (for payment flows)

### Step-by-Step Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ahbab2006/fixmate-client.git
   cd fixmate-client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file in the root of the project:
   ```bash
   cp .env.example .env.local
   # Or create .env.local manually
   ```
   Fill in the required variable names outlined in the [Environment Variables](#environment-variables) section below.

4. **Verify TypeScript compilation:**
   ```bash
   npx tsc --noEmit
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   The client will be accessible at [http://localhost:3000](http://localhost:3000).

6. **Run production build locally (Verification):**
   ```bash
   npm run build
   # Or using the Webpack builder:
   npx next build --webpack
   ```

---

## Environment Variables

Configure the following environment variable names inside `.env.local`. **Never commit `.env.local` or disclose secret values.**

| Variable Name | Required By | Description / Example Format |
| :--- | :--- | :--- |
| `MONGODB_URI` | `src/lib/auth.ts` | MongoDB connection string (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority`) |
| `BETTER_AUTH_SECRET` | `src/lib/auth.ts` | Random 32+ character string used to sign session cookies |
| `BETTER_AUTH_URL` | `src/lib/auth.ts` | Frontend base URL (`http://localhost:3000` in local development) |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | `src/lib/auth-client.ts` | Public client auth endpoint (`http://localhost:3000` locally) |
| `NEXT_PUBLIC_API_URL` | `src/lib/api.ts` | URL of the FixMate Express server (`http://localhost:5000` locally) |
| `GOOGLE_CLIENT_ID` | `src/lib/auth.ts` | Google Cloud OAuth 2.0 Web Client ID |
| `GOOGLE_CLIENT_SECRET` | `src/lib/auth.ts` | Google Cloud OAuth 2.0 Web Client Secret |
| `NEXT_PUBLIC_IMGBB_API_KEY` | Dashboard uploads | ImgBB V1 API Key for uploading profile and service pictures |

---

## Authentication & Social Sign-In

FixMate implements **Better Auth** with a native MongoDB adapter:
- **Email & Password Authentication:** Supports password hashing, email validation, and client-side password strength verification on registration.
- **Default Role Assignment:** New registrations automatically receive the `customer` role unless explicitly registered as a `technician`.
- **Google OAuth 2.0 Integration:** 
  - One-click Google sign-in available on the login page via `authClient.signIn.social({ provider: "google" })`.
  - Configured with `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
  - Google-authenticated users are automatically created with the `customer` role.
  - Redirect callback endpoint: `/api/auth/callback/google`.
- **Cross-Service JWT Authentication:** Better Auth issues signed JWT tokens that the client forwards to the Express backend in the `Authorization: Bearer <token>` header. The backend validates tokens against Better Auth’s remote JWKS endpoint (`/api/auth/jwks`).

---

## Backend API Integration

The client communicates with the **FixMate Server** (Node.js/Express) using helper utilities defined in `src/lib/api.ts`.

### Key Communication Points
- **Services:**
  - `GET /api/services` — Public approved services catalog.
  - `GET /api/services/:id` — Individual service details.
  - `GET /api/services/my-services` — Technician’s own service offerings.
  - `POST /api/services` — Technician creates a new service.
  - `PATCH /api/services/admin/status/:id` — Admin approves or rejects services.
- **Bookings:**
  - `POST /api/bookings` — Customer submits a booking request.
  - `GET /api/bookings/my-bookings` — Customer views personal booking history.
  - `GET /api/bookings/technician` — Technician views assigned requests.
  - `PATCH /api/bookings/:id/status` — Technician updates progress or marks completed with final pricing.
  - `PATCH /api/bookings/:id/cancel` — Customer cancels an unaccepted request.
- **Payments:**
  - `POST /api/payments/create-checkout-session` — Generates a hosted Stripe Checkout URL.
  - `POST /api/payments/verify-checkout-session` — Verifies completed Stripe session ID and records payment.
  - `GET /api/payments/my-payments` — Customer retrieves personal receipts.
  - `GET /api/payments/admin/all` — Administrator retrieves global revenue ledger.

---

## Stripe Checkout & Testing Instructions

### End-to-End Payment Flow
1. **Request Completion:** A customer books a service; the technician accepts, completes the job, and enters the final amount in USD (e.g., `$85.00`).
2. **Pay Button Activation:** The booking status transitions to `completed` and `paymentStatus: "unpaid"`.
3. **Initiating Payment:** In **Customer Dashboard > My Bookings**, the customer clicks **Pay Now**.
4. **Stripe Redirection:** The backend creates a Stripe Checkout Session and returns `session.url`. The browser redirects to Stripe’s hosted checkout.
5. **Settlement & Receipt:** Upon successful checkout, Stripe redirects the customer back to:
   ```text
   /payment/success?session_id={CHECKOUT_SESSION_ID}
   ```
6. **Automated Verification:** The `/payment/success` page reads the `session_id` query parameter, invokes `POST /api/payments/verify-checkout-session`, updates the database booking record to `paymentStatus: "paid"`, and displays a verified payment receipt.

### Testing with Stripe Test Cards
When running in Stripe Test Mode (`sk_test_...` / `pk_test_...`), use official Stripe test cards to simulate scenarios:

| Card Type | Card Number | Expiration | CVC | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| **Successful Payment** | `4242 •••• •••• 4242` | Any future date | Any 3 digits | Checkout succeeds &rarr; `/payment/success` verified |
| **Declined Card** | `4000 •••• •••• 0002` | Any future date | Any 3 digits | Stripe displays card declined message |
| **Authentication (3DS)** | `4000 •••• •••• 3155` | Any future date | Any 3 digits | Triggers 3D Secure modal challenge |

---

## Production Deployment Guide

### Recommended Platforms
- **Frontend / Client:** [Vercel](https://vercel.com/)
- **Backend / Server:** [Render](https://render.com/)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas)

### Deployment Steps
1. **MongoDB Atlas:** 
   - Add `0.0.0.0/0` to **Network Access > IP Access List** to permit connections from Vercel lambdas and Render containers.
   - Ensure the database user has `readWrite` permissions on database `fix-mate`.
2. **Deploy Server (Render):**
   - Connect `fixmate-server` repository.
   - Set Build Command: `npm install`, Start Command: `npm start`.
   - Configure environment variables: `MONGODB_URI`, `STRIPE_SECRET_KEY`, `CLIENT_URL`, `BETTER_AUTH_URL`.
3. **Deploy Client (Vercel):**
   - Import `fixmate-client` into Vercel.
   - Configure environment variables: `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_BETTER_AUTH_URL`, `NEXT_PUBLIC_API_URL` (Render URL), `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_IMGBB_API_KEY`.
4. **Synchronize Production URLs:**
   - Ensure `BETTER_AUTH_URL` and `CLIENT_URL` on Render match the production Vercel domain exactly (with `https://` and no trailing slash).
   - In **Google Cloud Console**, add `https://<your-vercel-domain>/api/auth/callback/google` to Authorized Redirect URIs.

---

## Repositories & Links

- **Frontend Client Repository:** [https://github.com/Ahbab2006/fixmate-client](https://github.com/Ahbab2006/fixmate-client)
- **Backend Server Repository:** [https://github.com/Ahbab2006/fixmate-server](https://github.com/Ahbab2006/fixmate-server)
- **Live Client Application:** [FixMate on Vercel](https://github.com/Ahbab2006/fixmate-client) *(Deploy target)*
- **Live Backend API:** [FixMate Server on Render](https://github.com/Ahbab2006/fixmate-server) *(Deploy target)*

---

## License

This project is licensed under the [ISC License](LICENSE).

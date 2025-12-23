# 🎫 EventHub — AI-Powered Event Management Platform

EventHub is a state-of-the-art, full-stack event management and discovery platform. Built with **Next.js 15**, it combines stunning modern aesthetics with powerful AI-driven assistance, real-time notifications, and a robust booking infrastructure.

---

## 🚀 Core Technology Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), TypeScript, TailwindCSS
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) with **RTK Query** for efficient data fetching and caching.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for smooth, premium-feel transitions.
- **Backend**: Next.js API Routes & Server Actions.
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) modeling.
- **AI Integration**: [Google Gemini AI](https://ai.google.dev/) for intelligent event assistance.
- **Image Hosting**: [ImageKit.io](https://imagekit.io/) for optimized image management.
- **Icons**: Lucide React.

---

## 🏗️ Project Structure At A Glance

```text
EventHub/
├── app/                  # Next.js Pages & API Routes
│   ├── (auth)/           # Authentication Flow
│   ├── (normalUser)/     # Attendee dashboard & Event Discovery
│   ├── (organization)/   # Organizer management tools
│   ├── api/              # Backend Endpoints
│   └── actions.ts        # Server-side direct mutations
├── components/           # Modular UI Components
│   ├── ai/               # AI Assistant interface
│   ├── events/           # Event-specific logic & UI
│   ├── ticket/           # Ticket generation & PDF logic
│   └── ui/               # Primary design system elements
├── lib/                  # Utilities, DB, & Shared Logic
├── middleware/           # Auth & Security Middleware
├── models/               # Mongoose Database Schemas
├── public/               # Static Assets
└── redux/                # Global State & RTK Query Slices
    ├── features/         # Domain-specific API definitions
    └── store.ts          # Central state store
```

---

## 📂 Folder-by-Folder Breakdown

The project follows a modular, feature-based architecture designed for scalability and maintainability.

### 1. `/app` — The Core (Next.js App Router)

The `app` directory handles routing, layouts, and API endpoints.

- **`(auth)`**: Contains all authentication-related pages (Login, Signup, Reset Password, Email Verification). Organized in a route group to keep auth logic isolated.
- **`(normalUser)`**: Contains the main application experience for attendees.
  - `/home`: Event discovery and detailed event pages.
  - `/bookings`: Personal booking history and ticket management.
  - `/profile`: User account settings and following management.
  - `/feedback`: General platform feedback center.
- **`(organization)`**: Exclusive routes for event organizers to create and manage their events.
- **`/api`**: The backend of the application. Organized by resource (bookings, auth, events, ai, notifications).
- **`actions.ts`**: Contains Next.js Server Actions for handling form submissions and direct database mutations.

### 2. `/components` — Modular UI System

Components are categorized by their role in the application.

- **`/ai`**: The `AIChat` ecosystem, providing an intelligent assistant overlay.
- **`/auth`**: Specialized authentication UI components like `AuthInitializer`.
- **`/booking`**: Card representations and lists for user bookings.
- **`/chat`**: Real-time event-specific chat components.
- **`/events`**: Complex event-related components (Tabs, Booking Forms, Lists).
- **`/layout`**: Global UI elements like the responsive Navbar and the `NotificationsDropdown`.
- **`/ticket`**: Logic and UI for generating and downloading event tickets.
- **`/ui`**: Shared, high-reusability components (Modals, Buttons, Loaders, Star Ratings).
- **`/animations`**: Wrapper components for Framer Motion effects.

### 3. `/redux` — Global State & RTK Query

EventHub uses a centralized API-first state management strategy.

- **`api.ts`**: The base API configuration with automated authentication header injection.
- **`/features`**: Specialized API slices for each domain:
  - `authApi`: Handles JWT flow, session recovery, and password resets.
  - `bookingsApi`: Manages event reservations and cancellations.
  - `eventsApi`: Handles event fetching and organizer management.
  - `notificationsApi`: Real-time notification management.
  - `aiApi`: Interface for Gemini AI chat interactions.
- **`store.ts`**: The central Redux store configured with middleware for RTK Query.

### 4. `/lib` — Utilities & Core Logic

- **`connectDb.ts`**: Optimized MongoDB connection singleton.
- **`notifications.ts`**: Server-side logic for creating and delivering in-app notifications.
- **`serverAuth.ts`**: Helpers for validating sessions within Server Components and Actions.
- **`imagekit.ts`**: Configuration for optimized image uploads and transformations.

### 5. `/models` — Data Schemas (Mongoose)

Strict TypeScript-enhanced schemas defining the database structure:

- `User`: Profiles, roles, following count, and created/booked events.
- `Event`: Timing, location, capacity, speakers, and schedule data.
- `Booking`: Links users to events with seat management.
- `Notification`: System alerts for reservations, cancellations, and new events.
- `Feedback`: User-submitted ratings for the platform and events.

### 6. `/middleware` — Security Layer

- **`authMiddleware`**: Protects API routes by validating JWT cookies and ensuring only authorized users can access sensitive endpoints.

---

## 💎 Key Features

- **Intelligent AI Assistant**: A persistent chat console powered by Gemini that answers queries about upcoming events.
- **Smart Notifications**: Real-time updates when events are booked, cancelled, or when organizers you follow post new events.
- **Automated Ticket System**: Instant generation of digital tickets upon booking.
- **Premium UI/UX**: Use of glassmorphism, dynamic gradients, and micro-animations for a high-end feel.
- **Organizer Suite**: A dedicated workspace for creators to track capacity, manage speakers, and build event schedules.

---

## �️ Getting Started

1.  **Clone & Install**:
    ```bash
    npm install
    ```
2.  **Environment Variables**:
    Create a `.env.local` based on the template, providing:
    - `MONGODB_URI`
    - `JWT_SECRET`
    - `GEMINI_API_KEY`
    - `IMAGEKIT_PRIVATE_KEY` & `IMAGEKIT_PUBLIC_KEY`
3.  **Run Development**:
    ```bash
    npm run dev
    ```

---

## 📜 Documentation & Schema

For more detailed information, see:

- `AUTH_README.md`: In-depth explanation of the security and authentication flow.
- `DATABASE_SCHEMA.md`: Documentation for the Mongoose models and relationships.

---

Developed with ❤️ by the EventHub Team.

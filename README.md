# 🎫 ECoNet — AI-Powered Event Management Platform

ECoNet is a state-of-the-art, full-stack event management and discovery platform. Built with **Next.js 15**, it combines stunning modern aesthetics with powerful AI-driven assistance, real-time WebSocket communication, and a robust booking infrastructure.

---

## 🚀 Core Technology Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router & Pages Router hybrid), TypeScript, TailwindCSS
- **Real-Time Engine**: [Socket.IO](https://socket.io/) (WebSockets) for instant chat and notifications.
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
ECoNet/
├── app/                  # Next.js App Router (Main Application)
│   ├── (auth)/           # Authentication Flow
│   ├── (normalUser)/     # Attendee dashboard & Event Discovery
│   ├── (organization)/   # Organizer management tools
│   ├── api/              # Standard REST API Endpoints
│   └── actions.ts        # Server-side direct mutations
├── pages/                # Next.js Pages Router (Specialized)
│   └── api/socket/       # Socket.IO Server Injection
├── components/           # Modular UI Components
│   ├── ai/               # AI Assistant interface
│   ├── chat/             # Real-time WebSocket Chat
│   ├── socket/           # Global Socket Connection Logic
│   └── ui/               # Primary design system elements
├── lib/                  # Utilities, DB, & Shared Logic
│   ├── socket-client.ts  # Client-side Socket instance
│   └── notifications.ts  # Server-side notification logic
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

The `app` directory handles the main routing, layouts, and standard API endpoints.

- **`(auth)`**: Contains all authentication-related pages (Login, Signup, Reset Password). Organized in a route group to keep auth logic isolated.
- **`(normalUser)`**: The main application experience for attendees.
  - `/home`: Event discovery with advanced filtering.
  - `/bookings`: Personal booking history and ticket management.
  - `/profile`: User account settings.
- **`(organization)`**: Exclusive routes for event organizers to create and track their events.
- **`/api`**: The REST backend. Organized by resource (events, auth, users, etc.).

### 2. `/pages` — Specialized Server Logic

- **`/pages/api/socket`**: This folder uses the older Page Router API structure specifically to access the underlying Node.js HTTP `NetServer`. This allows us to inject the **Socket.IO** server instance into the Next.js stack, enabling real-time WebSocket connections on the same port.

### 3. `/components` — Modular UI System

- **`/ai`**: The `AIChat` ecosystem, providing an intelligent assistant overlay.
- **`/chat`**: Real-time event discussion components. Powered by Socket.IO to receive messages instantly without polling.
- **`/socket`**: Contains `SocketInitializer`, a logical component that manages the global WebSocket connection lifecycle and authentication state.
- **`/layout`**: Global UI elements like the responsive `Navbar` and the real-time `NotificationsDropdown`.
- **`/ui`**: Shared, high-reusability components (Modals, Custom Buttons, Loaders).
- **`/animations`**: Wrapper components for complex Framer Motion effects.

### 4. `/redux` — Global State & RTK Query

ECoNet uses a centralized API-first state management strategy.

- **`api.ts`**: The base API configuration with automated authentication header injection.
- **`/features`**: Specialized API slices for each domain:
  - `authApi`: Handles JWT flow & session recovery.
  - `eventsApi`: Manages event fetching, optimistic updates for chat, and mutations.
  - `notificationsApi`: Manages user alerts (integrated with Socket.IO for real-time updates).

### 5. `/lib` — Utilities & Core Logic

- **`socket-client.ts`**: The client-side singleton for Socket.IO. It manages the connection state and provides the interface for components to emit/listen to events.
- **`notifications.ts`**: Server-side logic that saves notifications to MongoDB and immediately emits them to the specific user via WebSockets.
- **`connectDb.ts`**: Optimized MongoDB connection singleton.
- **`serverAuth.ts`**: Helpers for validating sessions within Server Components.

### 6. `/models` — Data Schemas (Mongoose)

Strict TypeScript-enhanced schemas defining the database structure:

- `User`: Profiles, roles, following count.
- `Event`: Timing, location, capacity, speakers, and schedule data.
- `Booking`: Links users to events with seat management.
- `Comment`: Event discussion messages with support for replies and pinning.
- `Notification`: System alerts for reservations and interactions.

---

## 💎 Key Features

- **Real-Time Interaction**: powered by **Socket.IO**:
  - **Live Chat**: Discuss events instantly with other attendees. No page refreshes needed.
  - **Instant Notifications**: Get alerted immediately when you receive a message or booking update.
- **Intelligent AI Assistant**: A persistent chat console powered by Gemini that answers queries about upcoming events.
- **Automated Ticket System**: Instant generation of digital tickets upon booking.
- **Premium UI/UX**: Use of glassmorphism, dynamic gradients, and micro-animations for a high-end feel.
- **Organizer Suite**: A dedicated workspace for creators to track capacity, manage speakers, and build event schedules.

---

## 🏗️ Getting Started

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

Developed with ❤️ by the ECoNet Team.

# 🧩 Real-Time Collaborative Task Board

A Trello-like real-time task board built with React and drag-and-drop functionality.

## Vercel Link : https://taskboard-assignment-tau.vercel.app/

## 🚀 Setup and Run Instructions

### 🛠 Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- npm or yarn package manager

### 📦 Installation & Running

1. **Clone/Download the project**

```bash
git clone <your-repo-url>
cd <your-project-directory>
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Start the development server**

```bash
npm start
# or
yarn dev
```

4. **Open your browser and navigate to**

```
http://localhost:5173
```

---

## 📜 Available Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |

---

## 🧠 Real-Time Architecture and Data Flow

### ✅ Current Architecture

The application uses a **client-side** state management approach with the following structure:

#### 🔁 Data Flow

- **State Management**: Managed using React’s `useState` hooks inside the `TaskBoard` component.

#### 🧱 Component Hierarchy

```
TaskBoard (main state container)
├── Column components (receive props, emit events)
└── TaskCard components (receive props, emit events)
```

#### ⚙️ Event Flow

- User interactions (drag/drop, edit, delete) → Trigger event handlers
- Event handlers → Update centralized state
- State change → Triggers React re-render
- UI → Updates based on new state

#### 🔑 Key Technologies

- **React** – Component framework and state handling
- **@dnd-kit** – Drag-and-drop functionality
- **Tailwind CSS** – Styling
- **shadcn/ui** – UI components
- **UUID** – Unique ID generation

---

## ❌ Real-Time Capabilities (Current Limitations)

> ⚠️ This project is currently **NOT** a real-time collaborative application.

- Each user session has **independent local state**
- Changes **do not sync** across users or tabs
- “Online users” indicator is **mock data**

---

## ⚖️ Tradeoffs and Limitations

### ❗ Current Limitations

- **No Real-Time Collaboration**:

  - No state sharing across browser tabs or devices

- **No Data Persistence**:

  - Page refresh results in data loss
  - No database or local storage used

- **Client-Side Only**:

  - No backend/API integration
  - No authentication or validation

- **Scalability**:

  - Centralized state in a single component (`TaskBoard.tsx` ~273+ lines)
  - No optimization for large data sets
  - No virtual scrolling for performance

- **Feature Gaps**:
  - No user assignment or due dates
  - No priority, history, audit logs
  - No file attachments

---

## 💡 To Make It Truly Real-Time

### 🔌 Backend Infrastructure Needed

- WebSocket server or Server-Sent Events
- Real-time database (e.g., PostgreSQL, MongoDB)
- Optional: Supabase or Firebase

### ✅ Recommended Stack (Supabase)

- Real-time PostgreSQL DB
- Built-in user authentication
- Real-time subscriptions
- Row Level Security (RLS)

### 📈 State Management Enhancements

- Adopt a scalable store (e.g., Zustand, Redux)
- Implement **optimistic updates**
- Add **conflict resolution** for concurrent edits

---

## 🌟 Current Strengths

- **Great UX**:

  - Smooth drag-and-drop
  - Responsive and modern UI

- **Solid Codebase**:

  - Well-structured components
  - TypeScript-enabled
  - Modular architecture

- **Easy to Extend**:
  - Reusable components
  - Clean and maintainable patterns

Setup and Run Instructions
Prerequisites
Node.js (v16 or higher)
npm or yarn package manager
Installation & Running
Clone/Download the project
Install dependencies:

npm install
Start the development server:

npm run dev
Open your browser and navigate to http://localhost:5173
Available Scripts
npm run dev - Start development server
npm run build - Build for production
npm run preview - Preview production build
Real-Time Architecture and Data Flow
Current Architecture
The application uses a client-side state management approach with the following components:

Data Flow:
State Management: React's useState hooks manage all application state locally in the TaskBoard component

Component Hierarchy:

TaskBoard (main state container)
├── Column components (receive props, emit events)
└── TaskCard components (receive props, emit events)
Event Flow:

User interactions (drag/drop, edit, delete) trigger event handlers
Event handlers update the centralized state
State changes trigger React re-renders
UI updates reflect the new state
Key Technologies:
React - Component framework and state management
@dnd-kit - Drag and drop functionality
Tailwind CSS - Styling
shadcn/ui - UI component library
UUID - Unique ID generation
Real-Time Capabilities (Current Limitations)
Currently, this is NOT a real-time collaborative application. Each user session maintains its own independent state. Changes made by one user are not visible to other users.

Tradeoffs and Limitations
Current Limitations:
No Real-Time Collaboration:

Each user has their own isolated state
No synchronization between different browser sessions
"Online users" indicator is mock data
No Data Persistence:

All data is lost when the page is refreshed
No database or local storage implementation
Client-Side Only:

No backend API
No user authentication
No data validation on the server side
Scalability Concerns:

All state management happens in a single component (TaskBoard.tsx is 273+ lines)
No optimized rendering for large datasets
No virtual scrolling for many tasks
Limited Functionality:

No task assignment to users
No due dates or priority levels
No task history or audit trail
No file attachments
To Make It Truly Real-Time, You Would Need:
Backend Infrastructure:

WebSocket server or Server-Sent Events
Database (PostgreSQL, MongoDB, etc.)
Real-time synchronization service
Recommended Approach with Lovable:

Supabase Integration (click the green Supabase button in the top-right)
This would provide:
Real-time database with PostgreSQL
Built-in authentication
Real-time subscriptions
Row Level Security (RLS)
State Management Improvements:

Move to a more scalable state management solution
Implement optimistic updates
Add conflict resolution for simultaneous edits
Current Strengths:
Great User Experience:

Smooth drag and drop interactions
Responsive design
Clean, modern UI
Solid Foundation:

Well-structured React components
TypeScript for type safety
Modular component architecture
Easy to Extend:

Clear separation of concerns
Reusable UI components
Consistent coding patterns
